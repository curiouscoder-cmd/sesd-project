import { NextRequest } from "next/server"

import { CreateExpenseDto, RouteNumberDto } from "@/lib/dto"
import { ExpenseService } from "@/lib/services/ExpenseService"
import { successResponse } from "@/lib/utils"
import { BaseController } from "./BaseController"

type ExpenseParams = { params: { expenseId: string } }

export class ExpenseController extends BaseController {
  constructor(private expenseService: ExpenseService) {
    super()
  }

  list = async (req: NextRequest) => {
    const auth = await this.getAuth(req)
    const { searchParams } = new URL(req.url)
    const groupId = RouteNumberDto.from(searchParams.get("groupId") ?? "", "Group ID")
    const expenses = await this.expenseService.getExpensesByGroup(groupId, auth.userId)

    return successResponse(expenses)
  }

  create = async (req: NextRequest) => {
    const auth = await this.getAuth(req)
    const input = CreateExpenseDto.from(await req.json())
    const expense = await this.expenseService.createExpense(input, auth.userId)

    return successResponse(expense, 201)
  }

  delete = async (req: NextRequest, { params }: ExpenseParams) => {
    const auth = await this.getAuth(req)
    const expenseId = this.getNumberParam(params.expenseId, "Expense ID")
    await this.expenseService.deleteExpense(expenseId, auth.userId)

    return successResponse({ message: "Expense deleted" })
  }
}
