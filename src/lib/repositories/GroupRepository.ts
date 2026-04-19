import { Prisma } from "@prisma/client"

import { BaseRepository } from "./BaseRepository"
import { publicUserSelect } from "./UserRepository"

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
    return this.prisma.group.findFirst({
      where: {
        id: groupId,
        createdBy: userId,
      },
    })
  }

  updateGroupName(groupId: number, name: string) {
    return this.prisma.group.update({
      where: { id: groupId },
      data: { name },
      include: groupDetailsInclude,
    })
  }

  deleteGroup(groupId: number) {
    return this.prisma.group.delete({
      where: { id: groupId },
    })
  }
}
