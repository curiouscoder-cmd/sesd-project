import { SplitStrategy, SplitResult } from "./SplitStrategy"
import { SplitDetail } from "@/lib/types"

export class PercentageSplitStrategy implements SplitStrategy {
  calculate(amount: number, memberIds: number[], details?: SplitDetail[]): SplitResult[] {
    if (!details || details.length === 0) {
      throw new Error("Percentage split requires percentage details for each member")
    }

    const totalPercentage = details.reduce((sum, d) => sum + (d.percentage ?? 0), 0)

    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new Error(`Percentages must sum to 100, got ${totalPercentage}`)
    }

    const results: SplitResult[] = []
    let allocated = 0

    const filtered = details.filter((d) => memberIds.includes(d.userId))

    filtered.forEach((d, index) => {
      if (index === filtered.length - 1) {
        results.push({
          userId: d.userId,
          amount: parseFloat((amount - allocated).toFixed(2)),
        })
      } else {
        const share = parseFloat(((amount * (d.percentage ?? 0)) / 100).toFixed(2))
        allocated += share
        results.push({ userId: d.userId, amount: share })
      }
    })

    return results
  }
}
