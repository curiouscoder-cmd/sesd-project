import { groupController } from "@/lib/container"
import { apiHandler } from "@/lib/utils"

export const dynamic = "force-dynamic"
export const POST = apiHandler(groupController.addMember)
