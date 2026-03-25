import { NextRequest } from "next/server"
import { GroupService } from "@/lib/services/GroupService"
import { withAuth } from "@/lib/middleware/withAuth"
import { successResponse, errorResponse } from "@/lib/utils/response"

const groupService = new GroupService()

export async function GET(req: NextRequest, { params }: { params: { groupId: string } }) {
  try {
    const auth = await withAuth(req)
    const groupId = parseInt(params.groupId)

    if (isNaN(groupId)) {
      return errorResponse("Invalid group ID", 400)
    }

    const group = await groupService.getGroupById(groupId, auth.userId)
    return successResponse(group)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch group"
    const status = message.includes("authenticated") ? 401 : message.includes("not found") ? 404 : 400
    return errorResponse(message, status)
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { groupId: string } }) {
  try {
    const auth = await withAuth(req)
    const groupId = parseInt(params.groupId)

    if (isNaN(groupId)) {
      return errorResponse("Invalid group ID", 400)
    }

    const body = await req.json()
    if (!body.name || body.name.trim().length === 0) {
      return errorResponse("Group name is required", 400)
    }

    const updatedGroup = await groupService.updateGroup(groupId, { name: body.name.trim() }, auth.userId)
    return successResponse(updatedGroup)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update group"
    const status = message.includes("authenticated") ? 401 : 400
    return errorResponse(message, status)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { groupId: string } }) {
  try {
    const auth = await withAuth(req)
    const groupId = parseInt(params.groupId)

    if (isNaN(groupId)) {
      return errorResponse("Invalid group ID", 400)
    }

    await groupService.deleteGroup(groupId, auth.userId)
    return successResponse({ message: "Group deleted" })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete group"
    const status = message.includes("authenticated") ? 401 : 400
    return errorResponse(message, status)
  }
}
