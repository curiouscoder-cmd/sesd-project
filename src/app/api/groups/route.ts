import { NextRequest } from "next/server"
import { GroupService } from "@/lib/services/GroupService"
import { withAuth } from "@/lib/middleware/withAuth"
import { successResponse, errorResponse } from "@/lib/utils/response"

const groupService = new GroupService()

export async function GET(req: NextRequest) {
  try {
    const auth = await withAuth(req)
    const groups = await groupService.getGroupsByUser(auth.userId)
    return successResponse(groups)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch groups"
    const status = message.includes("authenticated") ? 401 : 500
    return errorResponse(message, status)
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await withAuth(req)
    const body = await req.json()
    const { name } = body

    if (!name || name.trim().length === 0) {
      return errorResponse("Group name is required", 400)
    }

    const group = await groupService.createGroup({ name: name.trim() }, auth.userId)
    return successResponse(group, 201)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create group"
    const status = message.includes("authenticated") ? 401 : 400
    return errorResponse(message, status)
  }
}
