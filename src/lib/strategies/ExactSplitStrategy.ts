import { SplitStrategy, SplitResult } from "./SplitStrategy"
import { SplitDetail } from "@/lib/types"
import { ValidationError } from "@/lib/utils"

export class ExactSplitStrategy implements SplitStrategy {
  calculate(amount: number, memberIds: number[], details?: SplitDetail[]): SplitResult[] {
    if (!details || details.length === 0) {
      throw new ValidationError("Exact split requires amount details for each member")
    }

    const filteredDetails = details.filter((detail) => memberIds.includes(detail.userId))

    if (filteredDetails.length !== memberIds.length) {
      throw new ValidationError("Exact split requires an amount for every group member")
    }

    const totalSpecified = filteredDetails.reduce((sum, d) => sum + (d.amount ?? 0), 0)
    const diff = Math.abs(totalSpecified - amount)

    if (diff > 0.01) {
      throw new ValidationError(`Split amounts (${totalSpecified}) do not add up to total (${amount})`)
    }

    return filteredDetails
      .map((d) => ({
        userId: d.userId,
        amount: parseFloat((d.amount ?? 0).toFixed(2)),
      }))
  }
}
