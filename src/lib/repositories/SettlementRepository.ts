import { Prisma } from "@prisma/client"

import { BaseRepository } from "./BaseRepository"
import { publicUserSelect } from "./UserRepository"

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
    return this.prisma.settlement.create({
      data,
      include: settlementDetailsInclude,
    })
  }

  findSettlementsByGroupId(groupId: number) {
    return this.prisma.settlement.findMany({
      where: { groupId },
      include: settlementDetailsInclude,
      orderBy: { createdAt: "desc" },
    })
  }
}
