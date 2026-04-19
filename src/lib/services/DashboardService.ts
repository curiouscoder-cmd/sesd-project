import { ExpenseRepository } from "@/lib/repositories/ExpenseRepository"
import { GroupRepository } from "@/lib/repositories/GroupRepository"
import { SplitRepository } from "@/lib/repositories/SplitRepository"

export class DashboardService {
  constructor(
    private groupRepository: GroupRepository,
    private expenseRepository: ExpenseRepository,
    private splitRepository: SplitRepository
  ) {}

  async getDashboard(userId: number) {
    const groups = await this.groupRepository.findGroupsByUser(userId)
    const groupIds = groups.map((group) => group.id)

    if (groupIds.length === 0) {
      return {
        groupCount: 0,
        recentExpenses: [],
        totalOwed: 0,
        totalPaid: 0,
      }
    }

    const [recentExpenses, totalOwed, totalPaid] = await Promise.all([
      this.expenseRepository.findRecentExpenses(groupIds, 5),
      this.splitRepository.getTotalOwedByUser(userId, groupIds),
      this.expenseRepository.getTotalPaidByUser(userId, groupIds),
    ])

    return {
      groupCount: groups.length,
      recentExpenses,
      totalOwed: Number(totalOwed._sum.amount ?? 0),
      totalPaid: Number(totalPaid._sum.amount ?? 0),
    }
  }
}
