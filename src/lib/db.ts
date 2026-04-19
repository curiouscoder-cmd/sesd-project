import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

const hasConfiguredDatabaseUrl = Boolean(process.env.DATABASE_URL)

process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/splitcircle"
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "splitcircle-local-secret"

export const shouldUseMemoryStore = !hasConfiguredDatabaseUrl

const prisma = global.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}

export default prisma
