import { NextRequest } from "next/server"
import { withAuth } from "@/lib/middleware/withAuth"
import { successResponse, errorResponse } from "@/lib/utils/response"
import prisma from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const auth = await withAuth(req)

    const groups = await prisma.groupMember.findMany({
      where: { userId: auth.userId },
      include: {
        group: {
          include: {
            _count: { select: { expenses: true } },
          },
        },
      },
    })

    const groupIds = groups.map((g) => g.groupId)

    const recentExpenses = await prisma.expense.findMany({
      where: { groupId: { in: groupIds } },
      include: {
        group: { select: { id: true, name: true, email: true } },
        paidBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    const totalOwed = await prisma.split.aggregate({
      where: {
        owesId: auth.userId,
        expense: { groupId: { in: groupIds } },
      },
      _sum: { amount: true },
    })

    const totalPaid = await prisma.expense.aggregate({
      where: {
        paidById: auth.userId,
        groupId: { in: groupIds },
      },
      _sum: { amount: true },
    })

    return successResponse({
      groupCount: groups.length,
      recentExpenses,
      totalOwed: Number(totalOwed._sum.amount ?? 0),
      totalPaid: Number(totalPaid._sum.amount ?? 0),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load dashboard"
    const status = message.includes("authenticated") ? 401 : 500
    return errorResponse(message, status)
  }
}
