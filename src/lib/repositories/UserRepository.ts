import { Prisma } from "@prisma/client"

import { BaseRepository } from "./BaseRepository"

export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
} satisfies Prisma.UserSelect

export class UserRepository extends BaseRepository {
  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  findPublicById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        ...publicUserSelect,
        createdAt: true,
      },
    })
  }

  findPublicByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: publicUserSelect,
    })
  }

  createUser(data: { name: string; email: string; password: string }) {
    return this.prisma.user.create({
      data,
      select: {
        ...publicUserSelect,
        createdAt: true,
      },
    })
  }
}
