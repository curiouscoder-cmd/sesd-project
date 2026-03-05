import { NextRequest } from "next/server"
import { BalanceService } from "@/lib/services/BalanceService"
import { withAuth } from "@/lib/middleware/withAuth"
import { successResponse, errorResponse } from "@/lib/utils/response"

const balanceService = new BalanceService()

export async function GET(req: NextRequest) {
  try {
    const auth = await withAuth(req)
    const balances = await balanceService.getUserOverallBalance(auth.userId)
    return successResponse(balances)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch balances"
    const status = message.includes("authenticated") ? 401 : 500
    return errorResponse(message, status)
  }
}
