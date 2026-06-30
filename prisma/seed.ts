import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'kamran@example.com' },
    update: { 
      password: hashedPassword,
      name: 'Kamran Ahmad'
    },
    create: {
      email: 'kamran@example.com',
      name: 'Kamran Ahmad',
      password: hashedPassword,
    },
  });

  console.log({ user });
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
