import prisma from "@/lib/db"
import { CreateSettlementInput } from "@/lib/types"

export class SettlementService {
  async createSettlement(input: CreateSettlementInput, paidById: number) {
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: { groupId: input.groupId, userId: paidById },
      },
    })

    if (!membership) {
      throw new Error("You are not a member of this group")
    }

    const receiverMembership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: { groupId: input.groupId, userId: input.paidToId },
      },
    })

    if (!receiverMembership) {
      throw new Error("The person you are settling with is not in this group")
    }

    if (paidById === input.paidToId) {
      throw new Error("You cannot settle with yourself")
    }

    if (input.amount <= 0) {
      throw new Error("Settlement amount must be greater than 0")
    }

    const settlement = await prisma.settlement.create({
      data: {
        groupId: input.groupId,
        paidById,
        paidToId: input.paidToId,
        amount: input.amount,
      },
      include: {
        paidBy: { select: { id: true, name: true, email: true } },
        paidTo: { select: { id: true, name: true, email: true } },
      },
    })

    return settlement
  }

  async getSettlementsByGroup(groupId: number, userId: number) {
    const membership = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    })

    if (!membership) {
      throw new Error("You are not a member of this group")
    }

    return prisma.settlement.findMany({
      where: { groupId },
      include: {
        paidBy: { select: { id: true, name: true, email: true } },
        paidTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    })
  }
}
