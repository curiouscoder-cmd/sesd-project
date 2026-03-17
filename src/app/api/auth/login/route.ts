import { NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/services/AuthService"
import { errorResponse } from "@/lib/utils/response"

import { isValidEmail } from "@/lib/utils/validators"

const authService = new AuthService()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return errorResponse("Email and password are required", 400)
    }

    if (!isValidEmail(email)) {
      return errorResponse("Invalid email format", 400)
    }

    const result = await authService.login({ email, password })

    const response = NextResponse.json(
      { success: true, data: { user: result.user } },
      { status: 200 }
    )

    response.cookies.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed"
    return errorResponse(message, 401)
  }
}
