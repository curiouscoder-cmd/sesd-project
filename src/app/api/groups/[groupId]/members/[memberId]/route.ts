import { NextRequest } from "next/server"
import { GroupService } from "@/lib/services/GroupService"
import { withAuth } from "@/lib/middleware/withAuth"
import { successResponse, errorResponse } from "@/lib/utils/response"

const groupService = new GroupService()

export async function DELETE(
  req: NextRequest,
  { params }: { params: { groupId: string; memberId: string } }
) {
  try {
    const auth = await withAuth(req)
    const groupId = parseInt(params.groupId)
    const memberId = parseInt(params.memberId)

    if (isNaN(groupId) || isNaN(memberId)) {
      return errorResponse("Invalid group ID or member ID", 400)
    }

    await groupService.removeMember(groupId, memberId, auth.userId)
    return successResponse({ message: "Member removed" })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to remove member"
    const status = message.includes("authenticated") ? 401 : 400
    return errorResponse(message, status)
  }
}
