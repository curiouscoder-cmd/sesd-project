import { NextRequest } from "next/server"
import { GroupService } from "@/lib/services/GroupService"
import { withAuth } from "@/lib/middleware/withAuth"
import { successResponse, errorResponse } from "@/lib/utils/response"

const groupService = new GroupService()

export async function POST(req: NextRequest, { params }: { params: { groupId: string } }) {
  try {
    const auth = await withAuth(req)
    const groupId = parseInt(params.groupId)

    if (isNaN(groupId)) {
      return errorResponse("Invalid group ID", 400)
    }

    const body = await req.json()
    const { email } = body

    if (!email) {
      return errorResponse("Email is required", 400)
    }

    const member = await groupService.addMember(groupId, email, auth.userId)
    return successResponse(member, 201)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add member"
    const status = message.includes("authenticated") ? 401 : 400
    return errorResponse(message, status)
  }
}
