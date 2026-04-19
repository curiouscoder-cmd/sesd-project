import { Prisma } from "@prisma/client"

import { BaseRepository } from "./BaseRepository"
import { publicUserSelect } from "./UserRepository"
import { SplitTypeName } from "@/lib/types"
import { nextMemoryId, toExpenseDetails, useMemoryStore } from "@/lib/storage/memoryStore"

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
    if (this.useMemory) {
      const store = useMemoryStore()
      const now = new Date()
      const expense = {
        id: nextMemoryId("expense"),
        description: expenseData.description,
        amount: expenseData.amount,
        paidById: expenseData.paidById,
        groupId: expenseData.groupId,
        splitType: expenseData.splitType,
        createdAt: now,
        updatedAt: now,
      }

      store.expenses.push(expense)

      splitData.forEach((item) => {
        store.splits.push({
          id: nextMemoryId("split"),
          expenseId: expense.id,
          owesId: item.userId,
          amount: item.amount,
        })
      })

      return toExpenseDetails(expense)
    }

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
    if (this.useMemory) {
      const store = useMemoryStore()
      const expense = store.expenses.find((item) => item.id === expenseId)
      return Promise.resolve(expense ? toExpenseDetails(expense) : null)
    }

    return this.prisma.expense.findUnique({
      where: { id: expenseId },
      include: expenseDetailsInclude,
    })
  }

  findExpensesByGroupId(groupId: number) {
    if (this.useMemory) {
      const store = useMemoryStore()
      const expenses = store.expenses
        .filter((expense) => expense.groupId === groupId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map((expense) => toExpenseDetails(expense))

      return Promise.resolve(expenses)
    }

    return this.prisma.expense.findMany({
      where: { groupId },
      include: expenseDetailsInclude,
      orderBy: { createdAt: "desc" },
    })
  }

  deleteExpense(expenseId: number) {
    if (this.useMemory) {
      const store = useMemoryStore()
      store.expenses = store.expenses.filter((expense) => expense.id !== expenseId)
      store.splits = store.splits.filter((split) => split.expenseId !== expenseId)
      return Promise.resolve()
    }

    return this.prisma.expense.delete({
      where: { id: expenseId },
    })
  }

  findRecentExpenses(groupIds: number[], take = 5) {
    if (this.useMemory) {
      const store = useMemoryStore()
      const expenses = store.expenses
        .filter((expense) => groupIds.includes(expense.groupId))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, take)
        .map((expense) => toExpenseDetails(expense))

      return Promise.resolve(expenses)
    }

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
    if (this.useMemory) {
      const store = useMemoryStore()
      const total = store.expenses
        .filter((expense) => expense.paidById === userId && groupIds.includes(expense.groupId))
        .reduce((sum, expense) => sum + expense.amount, 0)

      return Promise.resolve({
        _sum: {
          amount: total,
        },
      })
    }

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
