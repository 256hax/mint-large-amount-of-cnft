import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findFirstTakerWhereSignatureNull = async () => {
  const taker = await prisma.taker.findFirst({
    where: {
      OR: [
        { signature: null }, // null supports null or ''
      ]
    },
    orderBy: {
      id: 'asc',
    },
  });

  console.log(taker);
}

findFirstTakerWhereSignatureNull()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
