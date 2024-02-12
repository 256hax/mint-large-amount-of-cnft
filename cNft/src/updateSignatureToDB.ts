import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateSignatureToDB = async (id: number, signature: string) => {
  try {
    const result = await prisma.taker.update({
      where: {
        id: id,
      },
      data: {
        signature: signature,
      },
    });

    await prisma.$disconnect();

    // console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// updateSignatureToDB(2, 'aaa');