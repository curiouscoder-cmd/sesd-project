import { NextRequest } from "next/server"

import { BalanceService } from "@/lib/services/BalanceService"
import { successResponse } from "@/lib/utils"
import { BaseController } from "./BaseController"

type GroupParams = { params: { groupId: string } }

export class BalanceController extends BaseController {
  constructor(private balanceService: BalanceService) {
    super()
  }

  getOverall = async (req: NextRequest) => {
    const auth = await this.getAuth(req)
    const balances = await this.balanceService.getUserOverallBalance(auth.userId)

    return successResponse(balances)
  }

  getGroupBalances = async (req: NextRequest, { params }: GroupParams) => {
    const auth = await this.getAuth(req)
    const groupId = this.getNumberParam(params.groupId, "Group ID")
    const balances = await this.balanceService.getGroupBalances(groupId, auth.userId)

    return successResponse(balances)
  }
}
