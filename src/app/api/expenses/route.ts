import { NextRequest } from "next/server"
import { ExpenseService } from "@/lib/services/ExpenseService"
import { withAuth } from "@/lib/middleware/withAuth"
import { successResponse, errorResponse } from "@/lib/utils/response"

const expenseService = new ExpenseService()

export async function GET(req: NextRequest) {
  try {
    const auth = await withAuth(req)
    const { searchParams } = new URL(req.url)
    const groupId = parseInt(searchParams.get("groupId") ?? "")

    if (isNaN(groupId)) {
      return errorResponse("groupId query param is required", 400)
    }

    const expenses = await expenseService.getExpensesByGroup(groupId, auth.userId)
    return successResponse(expenses)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch expenses"
    const status = message.includes("authenticated") ? 401 : 400
    return errorResponse(message, status)
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await withAuth(req)
    const body = await req.json()
    const { description, amount, paidById, groupId, splitType, splits } = body

    if (!description || !amount || !paidById || !groupId || !splitType) {
      return errorResponse("description, amount, paidById, groupId and splitType are required", 400)
    }

    if (amount <= 0) {
      return errorResponse("Amount must be greater than 0", 400)
    }

    const expense = await expenseService.createExpense(
      { description, amount, paidById, groupId, splitType, splits },
      auth.userId
    )

    return successResponse(expense, 201)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create expense"
    const status = message.includes("authenticated") ? 401 : 400
    return errorResponse(message, status)
  }
}
