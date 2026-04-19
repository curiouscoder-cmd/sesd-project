import { Prisma } from "@prisma/client"

import { BaseRepository } from "./BaseRepository"
import { publicUserSelect } from "./UserRepository"
import { SplitTypeName } from "@/lib/types"

const expenseDetailsInclude = {
  group: {
    select: {
      id: true,
      name: true,
    },
  },
  paidBy: {
    select: publicUserSelect,
  },
  splits: {
    include: {
      owes: {
        select: publicUserSelect,
      },
    },
  },
} satisfies Prisma.ExpenseInclude

type CreateExpenseData = {
  description: string
  amount: number
  paidById: number
  groupId: number
  splitType: SplitTypeName
}

type CreateSplitData = {
  userId: number
  amount: number
}

export class ExpenseRepository extends BaseRepository {
  async createExpenseWithSplits(expenseData: CreateExpenseData, splitData: CreateSplitData[]) {
    const createdExpense = await this.prisma.$transaction(async (transaction) => {
      const expense = await transaction.expense.create({
        data: expenseData,
      })

      await transaction.split.createMany({
        data: splitData.map((item) => ({
          expenseId: expense.id,
          owesId: item.userId,
          amount: item.amount,
        })),
      })

      return expense
    })

    return this.findExpenseById(createdExpense.id)
  }

  findExpenseById(expenseId: number) {
    return this.prisma.expense.findUnique({
      where: { id: expenseId },
      include: expenseDetailsInclude,
    })
  }

  findExpensesByGroupId(groupId: number) {
    return this.prisma.expense.findMany({
      where: { groupId },
      include: expenseDetailsInclude,
      orderBy: { createdAt: "desc" },
    })
  }

  deleteExpense(expenseId: number) {
    return this.prisma.expense.delete({
      where: { id: expenseId },
    })
  }

  findRecentExpenses(groupIds: number[], take = 5) {
    return this.prisma.expense.findMany({
      where: {
        groupId: {
          in: groupIds,
        },
      },
      include: expenseDetailsInclude,
      orderBy: { createdAt: "desc" },
      take,
    })
  }

  getTotalPaidByUser(userId: number, groupIds: number[]) {
    return this.prisma.expense.aggregate({
      where: {
        paidById: userId,
        groupId: {
          in: groupIds,
        },
      },
      _sum: {
        amount: true,
      },
    })
  }
}
