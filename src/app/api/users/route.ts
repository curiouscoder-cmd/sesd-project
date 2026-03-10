import { NextRequest } from "next/server"
import { withAuth } from "@/lib/middleware/withAuth"
import { successResponse, errorResponse } from "@/lib/utils/response"
import prisma from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    await withAuth(req)
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    if (!email) {
      return errorResponse("email query param is required", 400)
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    })

    if (!user) {
      return errorResponse("User not found", 404)
    }

    return successResponse(user)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to search user"
    const status = message.includes("authenticated") ? 401 : 500
    return errorResponse(message, status)
  }
}
