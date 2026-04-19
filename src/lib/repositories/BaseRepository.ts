import { PrismaClient } from "@prisma/client"
import { existsSync } from "fs"
import path from "path"

import prisma from "@/lib/db"

export abstract class BaseRepository {
  protected prisma: PrismaClient
  protected useMemory: boolean

  constructor(prismaClient: PrismaClient = prisma) {
    this.prisma = prismaClient
    this.useMemory =
      !process.env.DATABASE_URL ||
      (process.env.DATABASE_URL === "file:./dev.db" &&
        !existsSync(path.join(process.cwd(), "prisma", "dev.db")))
  }
}
