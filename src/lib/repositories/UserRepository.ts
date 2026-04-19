import { Prisma } from "@prisma/client"

import { BaseRepository } from "./BaseRepository"
import { nextMemoryId, toPublicUser, toUserWithCreatedAt, useMemoryStore } from "@/lib/storage/memoryStore"

export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
} satisfies Prisma.UserSelect

export class UserRepository extends BaseRepository {
  findByEmail(email: string) {
    if (this.useMemory) {
      const store = useMemoryStore()
      return Promise.resolve(store.users.find((user) => user.email === email) ?? null)
    }

    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  findPublicById(id: number) {
    if (this.useMemory) {
      const store = useMemoryStore()
      const user = store.users.find((item) => item.id === id)
      return Promise.resolve(user ? toUserWithCreatedAt(user) : null)
    }

    return this.prisma.user.findUnique({
      where: { id },
      select: {
        ...publicUserSelect,
        createdAt: true,
      },
    })
  }

  findPublicByEmail(email: string) {
    if (this.useMemory) {
      const store = useMemoryStore()
      const user = store.users.find((item) => item.email === email)
      return Promise.resolve(user ? toPublicUser(user) : null)
    }

    return this.prisma.user.findUnique({
      where: { email },
      select: publicUserSelect,
    })
  }

  createUser(data: { name: string; email: string; password: string }) {
    if (this.useMemory) {
      const store = useMemoryStore()
      const now = new Date()
      const user = {
        id: nextMemoryId("user"),
        name: data.name,
        email: data.email,
        password: data.password,
        createdAt: now,
        updatedAt: now,
      }

      store.users.push(user)

      return Promise.resolve(toUserWithCreatedAt(user))
    }

    return this.prisma.user.create({
      data,
      select: {
        ...publicUserSelect,
        createdAt: true,
      },
    })
  }
}
