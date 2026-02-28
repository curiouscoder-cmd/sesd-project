import { NextRequest } from "next/server"
import { AuthService } from "@/lib/services/AuthService"
import { successResponse, errorResponse } from "@/lib/utils/response"

const authService = new AuthService()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return errorResponse("Name, email and password are required", 400)
    }

    if (password.length < 6) {
      return errorResponse("Password must be at least 6 characters", 400)
    }

    const user = await authService.register({ name, email, password })
    return successResponse(user, 201)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed"
    return errorResponse(message, 400)
  }
}
