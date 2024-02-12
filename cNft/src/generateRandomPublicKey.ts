import { Keypair } from '@solana/web3.js';

const numberOfGeneratePublicKey = 10;

const generateRandomPublicKey = async () => {
  for (let i = 0; i < numberOfGeneratePublicKey; i++) {
    console.log(Keypair.generate().publicKey.toBase58());
  }
}

generateRandomPublicKey();