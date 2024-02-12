// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';
import fs from 'fs';
import { sleep } from '../../lib/sleep';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity, none, publicKey } from '@metaplex-foundation/umi';
import { mintV1 } from '@metaplex-foundation/mpl-bubblegum';

const mintWithoutCollection = async () => {
  // Taker List
  const takerListText = fs.readFileSync('./src/assets/takerList.txt', 'utf-8');
  const takerListArray = takerListText.split(/\n/);

  // ----------------------------------------------------
  //  Mint cNFT to Taker
  // ----------------------------------------------------
  console.log('leafOwner, Signature');

  try {
    const mint = async () => {
      for (const taker of takerListArray) {
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

        // ----------------------------------------------------
        //  Minting without a Collection
        // ----------------------------------------------------
        // Replace to your Merkle Tree.
        const merkleTree = publicKey(
          'AxR2UTtq3pZ5ZFaAs9tSWtiz4HftTAftKzMfs8ZjtcqQ'
        );

        const result = await mintV1(umi, {
          leafOwner: publicKey(taker),
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

        const signature = bs58.encode(result.signature);
        console.log(`${taker}, ${signature}`);

        await sleep(300);
      }
    };
    mint();
  } catch (e) {
    console.log(e);
  }
};

mintWithoutCollection();