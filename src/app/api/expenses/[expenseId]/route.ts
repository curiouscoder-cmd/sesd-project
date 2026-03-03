import { NextRequest } from "next/server"
import { ExpenseService } from "@/lib/services/ExpenseService"
import { withAuth } from "@/lib/middleware/withAuth"
import { successResponse, errorResponse } from "@/lib/utils/response"

const expenseService = new ExpenseService()

export async function DELETE(req: NextRequest, { params }: { params: { expenseId: string } }) {
  try {
    const auth = await withAuth(req)
    const expenseId = parseInt(params.expenseId)

    if (isNaN(expenseId)) {
      return errorResponse("Invalid expense ID", 400)
    }

    await expenseService.deleteExpense(expenseId, auth.userId)
    return successResponse({ message: "Expense deleted" })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete expense"
    const status = message.includes("authenticated") ? 401 : message.includes("not found") ? 404 : 400
    return errorResponse(message, status)
  }
}
