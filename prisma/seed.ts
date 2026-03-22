import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../src/lib/utils/password"

const prisma = new PrismaClient()

async function main() {
  const hashedPw = await hashPassword("password123")
  
  await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      name: "Test User",
      email: "test@example.com",
      password: hashedPw,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
