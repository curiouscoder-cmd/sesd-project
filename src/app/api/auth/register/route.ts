import { NextRequest } from "next/server"
import { AuthService } from "@/lib/services/AuthService"
import { successResponse, apiHandler, isValidEmail } from "@/lib/utils"

const authService = new AuthService()

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await req.json()
  const { name, email, password } = body

  if (!name || !email || !password) {
    throw new Error("Name, email and password are required")
  }

  if (!isValidEmail(email)) {
    throw new Error("Invalid email format")
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters")
  }

  const user = await authService.register({ name, email, password })
  return successResponse(user, 201)
})
