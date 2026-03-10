import { NextRequest } from "next/server"
import { withAuth } from "@/lib/middleware/withAuth"
import { successResponse, errorResponse } from "@/lib/utils/response"
import prisma from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const auth = await withAuth(req)
    
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { id: true, name: true, email: true, createdAt: true }
    })

    if (!user) {
      return errorResponse("User not found", 404)
    }

    return successResponse(user)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication failed"
    return errorResponse(message, 401)
  }
}
