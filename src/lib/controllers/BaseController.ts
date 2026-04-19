import { NextRequest } from "next/server"

import { RouteNumberDto } from "@/lib/dto"
import { withAuth } from "@/lib/middleware/withAuth"

export abstract class BaseController {
  protected getNumberParam(value: string, fieldName: string) {
    return RouteNumberDto.from(value, fieldName)
  }

  protected getAuth(req: NextRequest) {
    return withAuth(req)
  }
}
