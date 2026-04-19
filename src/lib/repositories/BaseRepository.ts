import { PrismaClient } from "@prisma/client"

import prisma from "@/lib/db"

export abstract class BaseRepository {
  protected prisma: PrismaClient

  constructor(prismaClient: PrismaClient = prisma) {
    this.prisma = prismaClient
  }
}
