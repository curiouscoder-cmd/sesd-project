import { Prisma } from "@prisma/client"

import { BaseRepository } from "./BaseRepository"
import { publicUserSelect } from "./UserRepository"
import { nextMemoryId, toGroupMemberWithUser, useMemoryStore } from "@/lib/storage/memoryStore"

const memberWithUserInclude = {
  user: {
    select: publicUserSelect,
  },
} satisfies Prisma.GroupMemberInclude

export class GroupMemberRepository extends BaseRepository {
  findMembership(groupId: number, userId: number) {
    if (this.useMemory) {
      const store = useMemoryStore()
      return Promise.resolve(
        store.groupMembers.find((member) => member.groupId === groupId && member.userId === userId) ?? null
      )
    }

    return this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: { groupId, userId },
      },
    })
  }

  findMembersByGroupId(groupId: number) {
    if (this.useMemory) {
      const store = useMemoryStore()
      const members = store.groupMembers
        .filter((member) => member.groupId === groupId)
        .map((member) => toGroupMemberWithUser(member, store.users.find((user) => user.id === member.userId)!))

      return Promise.resolve(members)
    }

    return this.prisma.groupMember.findMany({
      where: { groupId },
      include: memberWithUserInclude,
      orderBy: { joinedAt: "asc" },
    })
  }

  findMemberIdsByGroupId(groupId: number) {
    if (this.useMemory) {
      const store = useMemoryStore()
      return Promise.resolve(
        store.groupMembers
          .filter((member) => member.groupId === groupId)
          .map((member) => ({ userId: member.userId }))
      )
    }

    return this.prisma.groupMember.findMany({
      where: { groupId },
      select: { userId: true },
      orderBy: { joinedAt: "asc" },
    })
  }

  addMember(groupId: number, userId: number) {
    if (this.useMemory) {
      const store = useMemoryStore()
      const now = new Date()
      const member = {
        id: nextMemoryId("groupMember"),
        groupId,
        userId,
        joinedAt: now,
        updatedAt: now,
      }

      store.groupMembers.push(member)

      return Promise.resolve(member)
    }

    return this.prisma.groupMember.create({
      data: { groupId, userId },
    })
  }

  removeMember(groupId: number, userId: number) {
    if (this.useMemory) {
      const store = useMemoryStore()
      store.groupMembers = store.groupMembers.filter(
        (member) => !(member.groupId === groupId && member.userId === userId)
      )
      return Promise.resolve()
    }

    return this.prisma.groupMember.delete({
      where: {
        groupId_userId: { groupId, userId },
      },
    })
  }
}
