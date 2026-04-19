import { NextRequest } from "next/server"

import { CreateSettlementDto, RouteNumberDto } from "@/lib/dto"
import { SettlementService } from "@/lib/services/SettlementService"
import { successResponse } from "@/lib/utils"
import { BaseController } from "./BaseController"

export class SettlementController extends BaseController {
  constructor(private settlementService: SettlementService) {
    super()
  }

  list = async (req: NextRequest) => {
    const auth = await this.getAuth(req)
    const { searchParams } = new URL(req.url)
    const groupId = RouteNumberDto.from(searchParams.get("groupId") ?? "", "Group ID")
    const settlements = await this.settlementService.getSettlementsByGroup(groupId, auth.userId)

    return successResponse(settlements)
  }

  create = async (req: NextRequest) => {
    const auth = await this.getAuth(req)
    const input = CreateSettlementDto.from(await req.json())
    const settlement = await this.settlementService.createSettlement(input, auth.userId)

    return successResponse(settlement, 201)
  }
}
