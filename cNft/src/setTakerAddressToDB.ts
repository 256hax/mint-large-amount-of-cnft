import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const setTakerAddressToDB = async () => {
  const takerAddressCSV = fs.readFileSync('./src/assets/takerAddress.csv', 'utf8');
  const takerAddressArray = takerAddressCSV.split('\n');

  let result;

  for (let i = 0; i < takerAddressArray.length; i++) {
    result = await prisma.taker.create({
      data: {
        address: takerAddressArray[i],
      },
    });

    console.log(result);
  }
}

setTakerAddressToDB()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
