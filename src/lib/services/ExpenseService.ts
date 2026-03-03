import prisma from "@/lib/db"
import { SplitService } from "@/lib/services/SplitService"
import { CreateExpenseInput } from "@/lib/types"

export class ExpenseService {
  private splitService: SplitService

  constructor() {
    this.splitService = new SplitService()
  }

  async createExpense(input: CreateExpenseInput, requesterId: number) {
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: { groupId: input.groupId, userId: requesterId },
      },
    })

    if (!membership) {
      throw new Error("You are not a member of this group")
    }

    const members = await prisma.groupMember.findMany({
      where: { groupId: input.groupId },
      select: { userId: true },
    })

    const memberIds = members.map((m) => m.userId)

    const splits = this.splitService.calculateSplits(
      input.amount,
      memberIds,
      input.splitType,
      input.splits
    )

    const expense = await prisma.$transaction(async (tx) => {
      const created = await tx.expense.create({
        data: {
          description: input.description,
          amount: input.amount,
          paidById: input.paidById,
          groupId: input.groupId,
          splitType: input.splitType,
        },
      })

      await tx.split.createMany({
        data: splits.map((s) => ({
          expenseId: created.id,
          owesId: s.userId,
          amount: s.amount,
        })),
      })

      return created
    })

    return this.getExpenseById(expense.id)
  }

  async getExpenseById(expenseId: number) {
    return prisma.expense.findUnique({
      where: { id: expenseId },
      include: {
        group: {
          select: { id: true, name: true, email: true },
        },
        splits: {
          include: {
            owes: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    })
  }

  async getExpensesByGroup(groupId: number, userId: number) {
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: { groupId, userId },
      },
    })

    if (!membership) {
      throw new Error("You are not a member of this group")
    }

    return prisma.expense.findMany({
      where: { groupId },
      include: {
        group: {
          select: { id: true, name: true, email: true },
        },
        splits: {
          include: {
            owes: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  async deleteExpense(expenseId: number, userId: number) {
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    })

    if (!expense) {
      throw new Error("Expense not found")
    }

    if (expense.paidById !== userId) {
      throw new Error("Only the person who paid can delete this expense")
    }

    await prisma.expense.delete({ where: { id: expenseId } })
  }
}
