import { authController } from "@/lib/container"
import { apiHandler } from "@/lib/utils"

export const POST = apiHandler(authController.register)
