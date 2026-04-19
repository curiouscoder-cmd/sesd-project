import { NextRequest, NextResponse } from "next/server"

import { LoginUserDto, RegisterUserDto } from "@/lib/dto"
import { successResponse } from "@/lib/utils"
import { AuthService } from "@/lib/services/AuthService"
import { BaseController } from "./BaseController"

export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super()
  }

  register = async (req: NextRequest) => {
    const input = RegisterUserDto.from(await req.json())
    const user = await this.authService.register(input)

    return successResponse(user, 201)
  }

  login = async (req: NextRequest) => {
    const input = LoginUserDto.from(await req.json())
    const result = await this.authService.login(input)
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
  }

  me = async (req: NextRequest) => {
    const auth = await this.getAuth(req)
    const user = await this.authService.getMe(auth.userId)

    return successResponse(user)
  }

  logout = async (_req: NextRequest) => {
    const response = NextResponse.json({ success: true, message: "Logged out" })
    response.cookies.set("token", "", { maxAge: 0, path: "/" })
    return response
  }
}
