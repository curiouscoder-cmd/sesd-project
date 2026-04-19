import { authController } from "@/lib/container"
import { apiHandler } from "@/lib/utils"

export const dynamic = "force-dynamic"
export const GET = apiHandler(authController.me)
