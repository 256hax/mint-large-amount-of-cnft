# Mint Large Amount of cNFT

## Overview
Minting a Large Number of cNFTs.  
This code example demonstrates how to mint a large number (e.g., 100) of cNFTs.  
The code uses SQLite to store taker addresses and minted signatures.  

This is for experimental purposes only.

## Running Steps
1. Setup
2. Add Taker Address to DB(SQLite)
3. Upload JSON Metadata(e.g. Arweave)
4. Create Merkle Tree
5. Mint cNFT

## 1. Setup
### Install Packages in umi directory
```
% cd umi
% npm i
```

### Create .env in cNFT directory
```
% cd ..
% cd cNFT
% mv .env.example .env
```

Replace "ENDPOINT" in the .env file with your API key.  

Get your API Key here: [Metaplex DAS API RPCs](https://developers.metaplex.com/bubblegum/rpcs)

### Install Packages and init tables in cNFT directory
```
% npm i
% npx prisma migrate dev --name init
```

## 2. Add Taker Address to DB(SQLite)
If you want to test minting, generate random taker address.
You can modify taker address in takerAddress.csv.
```
% ts-node src/generateRandomPublicKey.ts > src/assets/takerAddress.csv
```

Add the taker address to the DB.
```
% ts-node src/addTakerAddressToDB.ts
```

## 3. Upload JSON Metadata(e.g. Arweave)
```
% cd ..
% cd umi
% ts-node src/irysUploader.ts
```

## 4. Create Merkle Tree
```
% cd ..
% cd cNFT
% ts-node src/createMerkleTree.ts
```

Write your Merkle Tree to src/mintWithoutCollection.ts.

## 5. Mint cNFT
```
% ts-node src/mintWithoutCollection.ts
```

## Remarks
### Get All Taker Address in DB
```
% ts-node src/findAllTakers.ts
```


### Prisma Command List
Init Table:
```
% npx prisma migrate dev --name init
```

Reset Data:
```
% npx prisma migrate reset
```