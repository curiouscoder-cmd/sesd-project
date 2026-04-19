import { groupController } from "@/lib/container"
import { apiHandler } from "@/lib/utils"

export const dynamic = "force-dynamic"
export const GET = apiHandler(groupController.list)
export const POST = apiHandler(groupController.create)
