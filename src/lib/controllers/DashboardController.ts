import { NextRequest } from "next/server"

import { DashboardService } from "@/lib/services/DashboardService"
import { successResponse } from "@/lib/utils"
import { BaseController } from "./BaseController"

export class DashboardController extends BaseController {
  constructor(private dashboardService: DashboardService) {
    super()
  }

  getDashboard = async (req: NextRequest) => {
    const auth = await this.getAuth(req)
    const data = await this.dashboardService.getDashboard(auth.userId)

    return successResponse(data)
  }
}
