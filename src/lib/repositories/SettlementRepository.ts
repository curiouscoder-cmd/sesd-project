import { Prisma } from "@prisma/client"

import { BaseRepository } from "./BaseRepository"
import { publicUserSelect } from "./UserRepository"
import { nextMemoryId, toSettlementDetails, useMemoryStore } from "@/lib/storage/memoryStore"

const settlementDetailsInclude = {
  paidBy: {
    select: publicUserSelect,
  },
  paidTo: {
    select: publicUserSelect,
  },
} satisfies Prisma.SettlementInclude

export class SettlementRepository extends BaseRepository {
  createSettlement(data: { groupId: number; paidById: number; paidToId: number; amount: number }) {
    if (this.useMemory) {
      const store = useMemoryStore()
      const now = new Date()
      const settlement = {
        id: nextMemoryId("settlement"),
        groupId: data.groupId,
        paidById: data.paidById,
        paidToId: data.paidToId,
        amount: data.amount,
        createdAt: now,
        updatedAt: now,
      }

      store.settlements.push(settlement)

      return Promise.resolve(toSettlementDetails(settlement))
    }

    return this.prisma.settlement.create({
      data,
      include: settlementDetailsInclude,
    })
  }

  findSettlementsByGroupId(groupId: number) {
    if (this.useMemory) {
      const store = useMemoryStore()
      const settlements = store.settlements
        .filter((settlement) => settlement.groupId === groupId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map((settlement) => toSettlementDetails(settlement))

      return Promise.resolve(settlements)
    }

    return this.prisma.settlement.findMany({
      where: { groupId },
      include: settlementDetailsInclude,
      orderBy: { createdAt: "desc" },
    })
  }
}
