import { BaseRepository } from "./BaseRepository"
import { useMemoryStore } from "@/lib/storage/memoryStore"

export class SplitRepository extends BaseRepository {
  getTotalOwedByUser(userId: number, groupIds: number[]) {
    if (this.useMemory) {
      const store = useMemoryStore()
      const total = store.splits
        .filter((split) => {
          const expense = store.expenses.find((item) => item.id === split.expenseId)
          return split.owesId === userId && expense ? groupIds.includes(expense.groupId) : false
        })
        .reduce((sum, split) => sum + split.amount, 0)

      return Promise.resolve({
        _sum: {
          amount: total,
        },
      })
    }

    return this.prisma.split.aggregate({
      where: {
        owesId: userId,
        expense: {
          groupId: {
            in: groupIds,
          },
        },
      },
      _sum: {
        amount: true,
      },
    })
  }
}
