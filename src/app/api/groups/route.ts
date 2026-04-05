import { NextRequest } from "next/server"
import { GroupService } from "@/lib/services/GroupService"
import { withAuth } from "@/lib/middleware/withAuth"
import { successResponse, apiHandler } from "@/lib/utils"

const groupService = new GroupService()

export const GET = apiHandler(async (req: NextRequest) => {
  const auth = await withAuth(req)
  const groups = await groupService.getGroupsByUser(auth.userId)
  return successResponse(groups)
})

export const POST = apiHandler(async (req: NextRequest) => {
  const auth = await withAuth(req)
  const body = await req.json()
  const { name } = body

  if (!name || name.trim().length === 0) {
    throw new Error("Group name is required")
  }

  const group = await groupService.createGroup({ name: name.trim() }, auth.userId)
  return successResponse(group, 201)
})
