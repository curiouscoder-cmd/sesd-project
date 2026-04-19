import { GroupMemberRepository } from "@/lib/repositories/GroupMemberRepository"
import { ExpenseRepository } from "@/lib/repositories/ExpenseRepository"
import { GroupRepository } from "@/lib/repositories/GroupRepository"
import { SettlementRepository } from "@/lib/repositories/SettlementRepository"
import { BalanceEntry, GroupBalanceSummary } from "@/lib/types"
import { ForbiddenError } from "@/lib/utils"

export class BalanceService {
  constructor(
    private groupRepository: GroupRepository,
    private groupMemberRepository: GroupMemberRepository,
    private expenseRepository: ExpenseRepository,
    private settlementRepository: SettlementRepository
  ) {}

  async getGroupBalances(groupId: number, userId: number): Promise<BalanceEntry[]> {
    const membership = await this.groupMemberRepository.findMembership(groupId, userId)

    if (!membership) {
      throw new ForbiddenError("You are not a member of this group")
    }

    const members = await this.groupMemberRepository.findMembersByGroupId(groupId)
    const expenses = await this.expenseRepository.findExpensesByGroupId(groupId)
    const settlements = await this.settlementRepository.findSettlementsByGroupId(groupId)
    const balanceMap = new Map<number, number>()

    members.forEach((member) => {
      balanceMap.set(member.userId, 0)
    })

    for (const expense of expenses) {
      const currentBalance = balanceMap.get(expense.paidById) ?? 0
      balanceMap.set(expense.paidById, currentBalance + Number(expense.amount))

      for (const split of expense.splits) {
        const splitBalance = balanceMap.get(split.owesId) ?? 0
        balanceMap.set(split.owesId, splitBalance - Number(split.amount))
      }
    }

    for (const settlement of settlements) {
      const payerBalance = balanceMap.get(settlement.paidById) ?? 0
      balanceMap.set(settlement.paidById, payerBalance - Number(settlement.amount))

      const receiverBalance = balanceMap.get(settlement.paidToId) ?? 0
      balanceMap.set(settlement.paidToId, receiverBalance + Number(settlement.amount))
    }

    return members.map((member) => ({
      userId: member.userId,
      name: member.user.name,
      email: member.user.email,
      balance: Number((balanceMap.get(member.userId) ?? 0).toFixed(2)),
    }))
  }

  async getUserOverallBalance(userId: number): Promise<GroupBalanceSummary[]> {
    const groups = await this.groupRepository.findGroupsByUser(userId)

    const results: GroupBalanceSummary[] = []

    for (const group of groups) {
      const balances = await this.getGroupBalances(group.id, userId)
      const userBalance = balances.find((item) => item.userId === userId)

      if (userBalance) {
        results.push({
          ...userBalance,
          groupId: group.id,
          groupName: group.name,
        })
      }
    }

    return results
  }
}
