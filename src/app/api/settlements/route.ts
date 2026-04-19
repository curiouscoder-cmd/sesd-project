import { settlementController } from "@/lib/container"
import { apiHandler } from "@/lib/utils"

export const dynamic = "force-dynamic"
export const GET = apiHandler(settlementController.list)
export const POST = apiHandler(settlementController.create)
