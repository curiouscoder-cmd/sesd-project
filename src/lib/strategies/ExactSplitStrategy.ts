import { SplitStrategy, SplitResult } from "./SplitStrategy"
import { SplitDetail } from "@/lib/types"

export class ExactSplitStrategy implements SplitStrategy {
  calculate(amount: number, memberIds: number[], details?: SplitDetail[]): SplitResult[] {
    if (!details || details.length === 0) {
      throw new Error("Exact split requires amount details for each member")
    }

    const totalSpecified = details.reduce((sum, d) => sum + (d.amount ?? 0), 0)
    const diff = Math.abs(totalSpecified - amount)

    if (diff > 0.01) {
      throw new Error(`Split amounts (${totalSpecified}) do not add up to total (${amount})`)
    }

    return details
      .filter((d) => memberIds.includes(d.userId))
      .map((d) => ({
        userId: d.userId,
        amount: parseFloat((d.amount ?? 0).toFixed(2)),
      }))
  }
}
