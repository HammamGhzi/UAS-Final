import bcrypt from 'bcrypt';
import prisma from '../src/config/prisma';

async function main() {
  const email = 'superadmin@gmail.com';
  const plainPassword = 'passwordkamu123';

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },  
    create: {
      email,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('Super admin siap:', user.email, user.role);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());