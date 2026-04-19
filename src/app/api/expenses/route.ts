import { expenseController } from "@/lib/container"
import { apiHandler } from "@/lib/utils"

export const dynamic = "force-dynamic"
export const GET = apiHandler(expenseController.list)
export const POST = apiHandler(expenseController.create)
