import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const countTakersWhereSignatureNull = async () => {
  const number = await prisma.taker.count({
    where: {
      signature: null
    },
  });

  // console.log(number);
  return number;
}

// countTakersWhereSignatureNull();