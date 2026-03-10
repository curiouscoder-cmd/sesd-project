import { NextRequest } from "next/server"
import { SettlementService } from "@/lib/services/SettlementService"
import { withAuth } from "@/lib/middleware/withAuth"
import { successResponse, errorResponse } from "@/lib/utils/response"

const settlementService = new SettlementService()

export async function GET(req: NextRequest) {
  try {
    const auth = await withAuth(req)
    const { searchParams } = new URL(req.url)
    const groupId = parseInt(searchParams.get("groupId") ?? "")

    if (isNaN(groupId)) {
      return errorResponse("groupId query param is required", 400)
    }

    const settlements = await settlementService.getSettlementsByGroup(groupId, auth.userId)
    return successResponse(settlements)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch settlements"
    const status = message.includes("authenticated") ? 401 : 400
    return errorResponse(message, status)
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await withAuth(req)
    const body = await req.json()
    const { groupId, paidToId, amount } = body

    if (!groupId || !paidToId || !amount) {
      return errorResponse("groupId, paidToId and amount are required", 400)
    }

    const settlement = await settlementService.createSettlement(
      { groupId, paidToId, amount },
      auth.userId
    )

    return successResponse(settlement, 201)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to record settlement"
    const status = message.includes("authenticated") ? 401 : 400
    return errorResponse(message, status)
  }
}
