import { Prisma } from "@prisma/client"

import { BaseRepository } from "./BaseRepository"
import { publicUserSelect } from "./UserRepository"

const memberWithUserInclude = {
  user: {
    select: publicUserSelect,
  },
} satisfies Prisma.GroupMemberInclude

export class GroupMemberRepository extends BaseRepository {
  findMembership(groupId: number, userId: number) {
    return this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: { groupId, userId },
      },
    })
  }

  findMembersByGroupId(groupId: number) {
    return this.prisma.groupMember.findMany({
      where: { groupId },
      include: memberWithUserInclude,
      orderBy: { joinedAt: "asc" },
    })
  }

  findMemberIdsByGroupId(groupId: number) {
    return this.prisma.groupMember.findMany({
      where: { groupId },
      select: { userId: true },
      orderBy: { joinedAt: "asc" },
    })
  }

  addMember(groupId: number, userId: number) {
    return this.prisma.groupMember.create({
      data: { groupId, userId },
    })
  }

  removeMember(groupId: number, userId: number) {
    return this.prisma.groupMember.delete({
      where: {
        groupId_userId: { groupId, userId },
      },
    })
  }
}
