import { CreateSettlementDto } from "@/lib/dto"
import { GroupMemberRepository } from "@/lib/repositories/GroupMemberRepository"
import { SettlementRepository } from "@/lib/repositories/SettlementRepository"
import { ForbiddenError, ValidationError } from "@/lib/utils"

export class SettlementService {
  constructor(
    private settlementRepository: SettlementRepository,
    private groupMemberRepository: GroupMemberRepository
  ) {}

  async createSettlement(input: CreateSettlementDto, paidById: number) {
    const senderMembership = await this.groupMemberRepository.findMembership(input.groupId, paidById)

    if (!senderMembership) {
      throw new ForbiddenError("You are not a member of this group")
    }

    const receiverMembership = await this.groupMemberRepository.findMembership(input.groupId, input.paidToId)

    if (!receiverMembership) {
      throw new ForbiddenError("The person you are settling with is not in this group")
    }

    if (paidById === input.paidToId) {
      throw new ValidationError("You cannot settle with yourself")
    }

    return this.settlementRepository.createSettlement({
      groupId: input.groupId,
      paidById,
      paidToId: input.paidToId,
      amount: input.amount,
    })
  }

  async getSettlementsByGroup(groupId: number, userId: number) {
    const membership = await this.groupMemberRepository.findMembership(groupId, userId)

    if (!membership) {
      throw new ForbiddenError("You are not a member of this group")
    }

    return this.settlementRepository.findSettlementsByGroupId(groupId)
  }
}
