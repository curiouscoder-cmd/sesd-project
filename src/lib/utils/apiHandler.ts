import { NextRequest } from "next/server"
import { errorResponse } from "./response"
import { AppError } from "./errors"
import { logger } from "./logger"

export function apiHandler(handler: (req: NextRequest, ...args: any[]) => Promise<any>) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      return await handler(req, ...args)
    } catch (error: any) {
      if (error instanceof AppError) {
        return errorResponse(error.message, error.statusCode)
      }
      logger.error("Unhandled API Error", error)
      return errorResponse("Internal server error", 500)
    }
  }
}
