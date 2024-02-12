// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';
import { sleep } from './lib/sleep';

// Prisma
import { countTakersWhereSignatureNull } from './countTakersWhereSignatureNull';
import { findFirstTakerWhereSignatureNull } from './findFirstTakerWhereSignatureNull';
import { updateSignatureToDB } from './updateSignatureToDB';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity, none, publicKey } from '@metaplex-foundation/umi';
import { mintV1 } from '@metaplex-foundation/mpl-bubblegum';

const mintWithoutCollection = async () => {
  try {
    let numberOfTakers = await countTakersWhereSignatureNull();
    console.log('Starting numberOfTakers:', numberOfTakers);

    while (numberOfTakers > 0) {
      // ----------------------------------------------------
      //  Setup
      // ----------------------------------------------------
      dotenv.config();

      // Set Endpoint
      const endpoint = process.env.ENDPOINT;
      if (!endpoint) throw new Error('endpoint not found.');

      const umi = createUmi(endpoint);

      // Set Payer
      const payerSecretKey = process.env.PAYER_SECRET_KEY;
      if (!payerSecretKey) throw new Error('payerSecretKey not found.');

      const secretKeyUInt8Array = new Uint8Array(JSON.parse(payerSecretKey));
      const payerKeypair =
        umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);

      umi.use(keypairIdentity(payerKeypair));

      console.log(1);
      // ----------------------------------------------------
      //  Minting without a Collection
      // ----------------------------------------------------
      // Get Taker Address from DB.
      const takerInfo = await findFirstTakerWhereSignatureNull();
      if (!takerInfo) throw new Error('Not found takerInfo.');

      // Replace to your Merkle Tree.
      const merkleTree = publicKey(
        'AxR2UTtq3pZ5ZFaAs9tSWtiz4HftTAftKzMfs8ZjtcqQ'
      );

      console.log(2);
      const mintingResult = await mintV1(umi, {
        leafOwner: publicKey(takerInfo.address),
        merkleTree,
        metadata: {
          name: 'My cNFT',
          uri: 'https://arweave.net/ZWOU6VbcltnL22QJQJAQ8hoojgs_fYHxXLE76khXt0c',
          sellerFeeBasisPoints: 500, // 500 = 5%
          collection: none(),
          creators: [
            { address: umi.identity.publicKey, verified: true, share: 100 },
          ],
        },
      }).sendAndConfirm(umi);

      console.log(3);
      // console.log minting result.
      const signature = bs58.encode(mintingResult.signature);
      console.log(`${takerInfo.id}, ${takerInfo.address}, ${signature}`);

      // Update signature to DB.
      const updatedResult = await updateSignatureToDB(takerInfo.id, signature);

      console.log(4);
      // If the update successful.
      if (updatedResult.signature) {
        await sleep(300);

        numberOfTakers = await countTakersWhereSignatureNull();
        console.log('Updated numberOfTakers:', numberOfTakers);
      } else {
        throw new Error('updatedResult.signature is null.');
      }
    }
  } catch (e) {
    console.log(e);
  }
};

mintWithoutCollection();