import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

process.env.DATABASE_URL = process.env.DATABASE_URL ?? "file:./dev.db"
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "splitcircle-local-secret"

const prisma = global.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}

export default prisma
