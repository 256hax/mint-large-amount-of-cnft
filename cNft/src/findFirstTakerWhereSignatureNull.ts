import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const taker = await prisma.taker.findFirst({
    where: {
      OR: [
        { signature: null }, // where: null or ''
      ]
    },
    orderBy: {
      id: 'asc',
    },
  });

  console.log(taker);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
