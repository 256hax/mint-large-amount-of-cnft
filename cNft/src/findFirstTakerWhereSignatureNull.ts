import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findFirstTakerWhereSignatureNull = async () => {
  try {
    const taker = await prisma.taker.findFirst({
      where: {
        OR: [
          { signature: null }, // null supports null or ''
        ],
      },
      orderBy: {
        id: 'asc',
      },
    });

    // console.log(taker);
    return taker;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
