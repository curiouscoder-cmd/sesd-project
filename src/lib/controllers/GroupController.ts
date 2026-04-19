import { NextRequest } from "next/server"

import { AddMemberDto, CreateGroupDto, UpdateGroupDto } from "@/lib/dto"
import { successResponse } from "@/lib/utils"
import { GroupService } from "@/lib/services/GroupService"
import { BaseController } from "./BaseController"

type GroupParams = { params: { groupId: string } }
type GroupMemberParams = { params: { groupId: string; memberId: string } }

export class GroupController extends BaseController {
  constructor(private groupService: GroupService) {
    super()
  }

  list = async (req: NextRequest) => {
    const auth = await this.getAuth(req)
    const groups = await this.groupService.getGroupsByUser(auth.userId)

    return successResponse(groups)
  }

  create = async (req: NextRequest) => {
    const auth = await this.getAuth(req)
    const input = CreateGroupDto.from(await req.json())
    const group = await this.groupService.createGroup(input, auth.userId)

    return successResponse(group, 201)
  }

  getById = async (req: NextRequest, { params }: GroupParams) => {
    const auth = await this.getAuth(req)
    const groupId = this.getNumberParam(params.groupId, "Group ID")
    const group = await this.groupService.getGroupById(groupId, auth.userId)

    return successResponse(group)
  }

  update = async (req: NextRequest, { params }: GroupParams) => {
    const auth = await this.getAuth(req)
    const groupId = this.getNumberParam(params.groupId, "Group ID")
    const input = UpdateGroupDto.from(await req.json())
    const group = await this.groupService.updateGroup(groupId, input, auth.userId)

    return successResponse(group)
  }

  delete = async (req: NextRequest, { params }: GroupParams) => {
    const auth = await this.getAuth(req)
    const groupId = this.getNumberParam(params.groupId, "Group ID")
    await this.groupService.deleteGroup(groupId, auth.userId)

    return successResponse({ message: "Group deleted" })
  }

  addMember = async (req: NextRequest, { params }: GroupParams) => {
    const auth = await this.getAuth(req)
    const groupId = this.getNumberParam(params.groupId, "Group ID")
    const input = AddMemberDto.from(await req.json())
    const member = await this.groupService.addMember(groupId, input, auth.userId)

    return successResponse(member, 201)
  }

  removeMember = async (req: NextRequest, { params }: GroupMemberParams) => {
    const auth = await this.getAuth(req)
    const groupId = this.getNumberParam(params.groupId, "Group ID")
    const memberId = this.getNumberParam(params.memberId, "Member ID")
    await this.groupService.removeMember(groupId, memberId, auth.userId)

    return successResponse({ message: "Member removed" })
  }
}
