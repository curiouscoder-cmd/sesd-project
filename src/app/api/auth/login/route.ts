import { NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/services/AuthService"
import { apiHandler, isValidEmail } from "@/lib/utils"

const authService = new AuthService()

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await req.json()
  const { email, password } = body

  if (!email || !password) {
    throw new Error("Email and password are required")
  }

  if (!isValidEmail(email)) {
    throw new Error("Invalid email format")
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
})
