import prisma from "@/lib/db"
import { BalanceEntry } from "@/lib/types"

export class BalanceService {
  async getGroupBalances(groupId: number, userId: number): Promise<BalanceEntry[]> {
    const membership = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    })

    if (!membership) {
      throw new Error("You are not a member of this group")
    }

    const members = await prisma.groupMember.findMany({
      where: { groupId },
      include: { user: { select: { id: true, name: true, email: true } } },
    })

    const expenses = await prisma.expense.findMany({
      where: { groupId },
      include: { splits: true },
    })

    const settlements = await prisma.settlement.findMany({ where: { groupId } })

    const balanceMap = new Map<number, number>()
    members.forEach((m) => balanceMap.set(m.userId, 0))

    for (const expense of expenses) {
      const paidById = expense.paidById
      const current = balanceMap.get(paidById) ?? 0
      balanceMap.set(paidById, current + Number(expense.amount))

      for (const split of expense.splits) {
        const owesId = split.owesId
        const splitAmount = Number(split.amount)
        const oweCurrent = balanceMap.get(owesId) ?? 0
        balanceMap.set(owesId, oweCurrent - splitAmount)
      }
    }

    for (const s of settlements) {
      const payerBalance = balanceMap.get(s.paidById) ?? 0
      balanceMap.set(s.paidById, payerBalance - Number(s.amount))

      const receiverBalance = balanceMap.get(s.paidToId) ?? 0
      balanceMap.set(s.paidToId, receiverBalance + Number(s.amount))
    }

    return members.map((m) => ({
      userId: m.userId,
      name: m.user.name,
      email: m.user.email,
      balance: parseFloat((balanceMap.get(m.userId) ?? 0).toFixed(2)),
    }))
  }

  async getUserOverallBalance(userId: number): Promise<BalanceEntry[]> {
    const userGroups = await prisma.groupMember.findMany({
      where: { userId },
      select: { groupId: true },
    })

    const groupIds = userGroups.map((g) => g.groupId)

    const results: BalanceEntry[] = []

    for (const groupId of groupIds) {
      const entries = await this.getGroupBalances(groupId, userId)
      const userEntry = entries.find((e) => e.userId === userId)
      if (userEntry) {
        results.push(userEntry)
      }
    }

    return results
  }
}
