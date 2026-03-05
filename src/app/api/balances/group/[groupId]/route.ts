import { NextRequest } from "next/server"
import { BalanceService } from "@/lib/services/BalanceService"
import { withAuth } from "@/lib/middleware/withAuth"
import { successResponse, errorResponse } from "@/lib/utils/response"

const balanceService = new BalanceService()

export async function GET(req: NextRequest, { params }: { params: { groupId: string } }) {
  try {
    const auth = await withAuth(req)
    const groupId = parseInt(params.groupId)

    if (isNaN(groupId)) {
      return errorResponse("Invalid group ID", 400)
    }

    const balances = await balanceService.getGroupBalances(groupId, auth.userId)
    return successResponse(balances)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch group balances"
    const status = message.includes("authenticated") ? 401 : 400
    return errorResponse(message, status)
  }
}
