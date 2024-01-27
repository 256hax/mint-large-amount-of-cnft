// Lib
import * as dotenv from 'dotenv';
import fs from 'fs';

// Solana
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

// Metaplex
import { keypairIdentity, createGenericFile } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';

const upload = async () => {
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
  //  Upload JSON Metadata
  // ----------------------------------------------------
  umi.use(irysUploader());

  // Image
  const fileBuffer = fs.readFileSync('./src/assets/nft-image.png');
  const file = createGenericFile(fileBuffer, 'nft-image.png', {
    contentType: 'image/png',
  });

  const uploadPrice = await umi.uploader.getUploadPrice([file]);
  const [fileUri] = await umi.uploader.upload([file]);

  const uri = await umi.uploader.uploadJson({
    name: 'My cNFT',
    description: 'My description',
    image: fileUri,
    // external_url: 'https://example.com/',
    attributes: [
      {
        trait_type: 'Category',
        value: 'test',
      },
    ],
  });

  console.log('payer =>', payerKeypair.publicKey.toString());
  console.log('uploadPrice =>', Number(uploadPrice.basisPoints) / LAMPORTS_PER_SOL, uploadPrice.identifier);
  console.log('uri =>', uri);
};

upload();