import { PrismaClient } from "@prisma/client"

import prisma, { shouldUseMemoryStore } from "@/lib/db"

export abstract class BaseRepository {
  protected prisma: PrismaClient
  protected useMemory: boolean

  constructor(prismaClient: PrismaClient = prisma) {
    this.prisma = prismaClient
    this.useMemory = shouldUseMemoryStore
  }
}
