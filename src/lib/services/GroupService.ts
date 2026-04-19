import { AddMemberDto, CreateGroupDto, UpdateGroupDto } from "@/lib/dto"
import { GroupMemberRepository } from "@/lib/repositories/GroupMemberRepository"
import { GroupRepository } from "@/lib/repositories/GroupRepository"
import { UserRepository } from "@/lib/repositories/UserRepository"
import { ConflictError, ForbiddenError, NotFoundError } from "@/lib/utils"

export class GroupService {
  constructor(
    private groupRepository: GroupRepository,
    private groupMemberRepository: GroupMemberRepository,
    private userRepository: UserRepository
  ) {}

  createGroup(input: CreateGroupDto, userId: number) {
    return this.groupRepository.createGroup(input.name, userId)
  }

  getGroupsByUser(userId: number) {
    return this.groupRepository.findGroupsByUser(userId)
  }

  async getGroupById(groupId: number, userId: number) {
    const group = await this.groupRepository.findAccessibleGroup(groupId, userId)

    if (!group) {
      throw new NotFoundError("Group not found or you are not a member")
    }

    return group
  }

  async updateGroup(groupId: number, input: UpdateGroupDto, userId: number) {
    const group = await this.groupRepository.findOwnedGroup(groupId, userId)

    if (!group) {
      throw new ForbiddenError("Only the group creator can update the group")
    }

    return this.groupRepository.updateGroupName(groupId, input.name)
  }

  async deleteGroup(groupId: number, userId: number) {
    const group = await this.groupRepository.findOwnedGroup(groupId, userId)

    if (!group) {
      throw new ForbiddenError("Only the group creator can delete this group")
    }

    await this.groupRepository.deleteGroup(groupId)
  }

  async addMember(groupId: number, input: AddMemberDto, userId: number) {
    const group = await this.groupRepository.findAccessibleGroup(groupId, userId)

    if (!group) {
      throw new ForbiddenError("You are not a member of this group")
    }

    const userToAdd = await this.userRepository.findPublicByEmail(input.email)

    if (!userToAdd) {
      throw new NotFoundError("No user found with that email")
    }

    const existingMembership = await this.groupMemberRepository.findMembership(groupId, userToAdd.id)

    if (existingMembership) {
      throw new ConflictError("User is already a member of this group")
    }

    await this.groupMemberRepository.addMember(groupId, userToAdd.id)

    return userToAdd
  }

  async removeMember(groupId: number, memberId: number, userId: number) {
    const group = await this.groupRepository.findOwnedGroup(groupId, userId)

    if (!group) {
      throw new ForbiddenError("Only the group creator can remove members")
    }

    if (memberId === userId) {
      throw new ForbiddenError("Group creator cannot be removed")
    }

    const membership = await this.groupMemberRepository.findMembership(groupId, memberId)

    if (!membership) {
      throw new NotFoundError("Member not found in this group")
    }

    await this.groupMemberRepository.removeMember(groupId, memberId)
  }
}
