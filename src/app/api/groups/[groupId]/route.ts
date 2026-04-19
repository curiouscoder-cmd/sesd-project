import { groupController } from "@/lib/container"
import { apiHandler } from "@/lib/utils"

export const dynamic = "force-dynamic"
export const GET = apiHandler(groupController.getById)
export const PATCH = apiHandler(groupController.update)
export const DELETE = apiHandler(groupController.delete)
