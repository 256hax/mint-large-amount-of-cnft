import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const findAllTakers = async () => {
  const taker = await prisma.taker.findMany({
    orderBy: {
      id: 'asc',
    },
  });

  console.log(taker);
}

findAllTakers();