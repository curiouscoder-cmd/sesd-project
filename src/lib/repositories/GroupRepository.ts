import { Prisma } from "@prisma/client"

import { BaseRepository } from "./BaseRepository"
import { publicUserSelect } from "./UserRepository"
import { nextMemoryId, toGroupDetails, useMemoryStore } from "@/lib/storage/memoryStore"

const groupDetailsInclude = {
  members: {
    include: {
      user: {
        select: publicUserSelect,
      },
    },
  },
  _count: {
    select: { expenses: true },
  },
} satisfies Prisma.GroupInclude

export class GroupRepository extends BaseRepository {
  createGroup(name: string, createdBy: number) {
    if (this.useMemory) {
      const store = useMemoryStore()
      const now = new Date()
      const group = {
        id: nextMemoryId("group"),
        name,
        createdBy,
        createdAt: now,
        updatedAt: now,
      }

      store.groups.push(group)
      store.groupMembers.push({
        id: nextMemoryId("groupMember"),
        groupId: group.id,
        userId: createdBy,
        joinedAt: now,
        updatedAt: now,
      })

      return Promise.resolve(toGroupDetails(group))
    }

    return this.prisma.group.create({
      data: {
        name,
        createdBy,
        members: {
          create: { userId: createdBy },
        },
      },
      include: groupDetailsInclude,
    })
  }

  findGroupsByUser(userId: number) {
    if (this.useMemory) {
      const store = useMemoryStore()
      const groups = store.groups
        .filter((group) =>
          store.groupMembers.some((member) => member.groupId === group.id && member.userId === userId)
        )
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map((group) => toGroupDetails(group))

      return Promise.resolve(groups)
    }

    return this.prisma.group.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: groupDetailsInclude,
      orderBy: { createdAt: "desc" },
    })
  }

  findAccessibleGroup(groupId: number, userId: number) {
    if (this.useMemory) {
      const store = useMemoryStore()
      const group = store.groups.find(
        (item) =>
          item.id === groupId &&
          store.groupMembers.some((member) => member.groupId === groupId && member.userId === userId)
      )

      return Promise.resolve(group ? toGroupDetails(group) : null)
    }

    return this.prisma.group.findFirst({
      where: {
        id: groupId,
        members: {
          some: { userId },
        },
      },
      include: groupDetailsInclude,
    })
  }

  findOwnedGroup(groupId: number, userId: number) {
    if (this.useMemory) {
      const store = useMemoryStore()
      return Promise.resolve(store.groups.find((group) => group.id === groupId && group.createdBy === userId) ?? null)
    }

    return this.prisma.group.findFirst({
      where: {
        id: groupId,
        createdBy: userId,
      },
    })
  }

  updateGroupName(groupId: number, name: string) {
    if (this.useMemory) {
      const store = useMemoryStore()
      const group = store.groups.find((item) => item.id === groupId)!
      group.name = name
      group.updatedAt = new Date()
      return Promise.resolve(toGroupDetails(group))
    }

    return this.prisma.group.update({
      where: { id: groupId },
      data: { name },
      include: groupDetailsInclude,
    })
  }

  deleteGroup(groupId: number) {
    if (this.useMemory) {
      const store = useMemoryStore()
      const expenseIds = store.expenses.filter((expense) => expense.groupId === groupId).map((expense) => expense.id)
      store.groups = store.groups.filter((group) => group.id !== groupId)
      store.groupMembers = store.groupMembers.filter((member) => member.groupId !== groupId)
      store.expenses = store.expenses.filter((expense) => expense.groupId !== groupId)
      store.splits = store.splits.filter((split) => !expenseIds.includes(split.expenseId))
      store.settlements = store.settlements.filter((settlement) => settlement.groupId !== groupId)
      return Promise.resolve()
    }

    return this.prisma.group.delete({
      where: { id: groupId },
    })
  }
}
