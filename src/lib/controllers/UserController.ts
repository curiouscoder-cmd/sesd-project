import { NextRequest } from "next/server"

import { EmailQueryDto } from "@/lib/dto"
import { UserService } from "@/lib/services/UserService"
import { successResponse } from "@/lib/utils"
import { BaseController } from "./BaseController"

export class UserController extends BaseController {
  constructor(private userService: UserService) {
    super()
  }

  getByEmail = async (req: NextRequest) => {
    await this.getAuth(req)
    const { searchParams } = new URL(req.url)
    const query = EmailQueryDto.from(searchParams.get("email"))
    const user = await this.userService.getUserByEmail(query.email)

    return successResponse(user)
  }
}
