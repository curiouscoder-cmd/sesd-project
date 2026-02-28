import prisma from "@/lib/db"
import { CreateGroupInput } from "@/lib/types"

export class GroupService {
  async createGroup(input: CreateGroupInput, userId: number) {
    const group = await prisma.group.create({
      data: {
        name: input.name,
        createdBy: userId,
        members: {
          create: { userId },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    })

    return group
  }

  async getGroupsByUser(userId: number) {
    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        _count: {
          select: { expenses: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return groups
  }

  async getGroupById(groupId: number, userId: number) {
    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        members: { some: { userId } },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        _count: {
          select: { expenses: true },
        },
      },
    })

    if (!group) {
      throw new Error("Group not found or you are not a member")
    }

    return group
  }

  async addMember(groupId: number, email: string, requesterId: number) {
    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        createdBy: requesterId,
      },
    })

    if (!group) {
      throw new Error("Only the group creator can add members")
    }

    const userToAdd = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    })

    if (!userToAdd) {
      throw new Error("No user found with that email")
    }

    const alreadyMember = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: { groupId, userId: userToAdd.id },
      },
    })

    if (alreadyMember) {
      throw new Error("User is already a member of this group")
    }

    await prisma.groupMember.create({
      data: { groupId, userId: userToAdd.id },
    })

    return userToAdd
  }
}
