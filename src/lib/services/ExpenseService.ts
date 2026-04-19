import { CreateExpenseDto } from "@/lib/dto"
import { GroupMemberRepository } from "@/lib/repositories/GroupMemberRepository"
import { ExpenseRepository } from "@/lib/repositories/ExpenseRepository"
import { ForbiddenError, NotFoundError } from "@/lib/utils"
import { SplitService } from "./SplitService"

export class ExpenseService {
  constructor(
    private expenseRepository: ExpenseRepository,
    private groupMemberRepository: GroupMemberRepository,
    private splitService: SplitService
  ) {}

  async createExpense(input: CreateExpenseDto, requesterId: number) {
    const requesterMembership = await this.groupMemberRepository.findMembership(input.groupId, requesterId)

    if (!requesterMembership) {
      throw new ForbiddenError("You are not a member of this group")
    }

    const payerMembership = await this.groupMemberRepository.findMembership(input.groupId, input.paidById)

    if (!payerMembership) {
      throw new ForbiddenError("The payer must be a member of this group")
    }

    const members = await this.groupMemberRepository.findMemberIdsByGroupId(input.groupId)
    const memberIds = members.map((member) => member.userId)

    const splits = this.splitService.calculateSplits(
      input.amount,
      memberIds,
      input.splitType,
      input.splits
    )

    return this.expenseRepository.createExpenseWithSplits(
      {
        description: input.description,
        amount: input.amount,
        paidById: input.paidById,
        groupId: input.groupId,
        splitType: input.splitType,
      },
      splits
    )
  }

  async getExpensesByGroup(groupId: number, userId: number) {
    const membership = await this.groupMemberRepository.findMembership(groupId, userId)

    if (!membership) {
      throw new ForbiddenError("You are not a member of this group")
    }

    return this.expenseRepository.findExpensesByGroupId(groupId)
  }

  async deleteExpense(expenseId: number, userId: number) {
    const expense = await this.expenseRepository.findExpenseById(expenseId)

    if (!expense) {
      throw new NotFoundError("Expense not found")
    }

    if (expense.paidById !== userId) {
      throw new ForbiddenError("Only the person who paid can delete this expense")
    }

    await this.expenseRepository.deleteExpense(expenseId)
  }
}
