import { SplitStrategy, SplitResult } from "./SplitStrategy"
import { SplitDetail } from "@/lib/types"
import { ValidationError } from "@/lib/utils"

export class EqualSplitStrategy implements SplitStrategy {
  calculate(amount: number, memberIds: number[], _details?: SplitDetail[]): SplitResult[] {
    if (memberIds.length === 0) {
      throw new ValidationError("At least one member is required")
    }

    const perPerson = parseFloat((amount / memberIds.length).toFixed(2))
    const total = perPerson * (memberIds.length - 1)
    const lastShare = parseFloat((amount - total).toFixed(2))

    return memberIds.map((userId, index) => ({
      userId,
      amount: index === memberIds.length - 1 ? lastShare : perPerson,
    }))
  }
}
