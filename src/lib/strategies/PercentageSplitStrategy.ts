import { SplitStrategy, SplitResult } from "./SplitStrategy"
import { SplitDetail } from "@/lib/types"
import { ValidationError } from "@/lib/utils"

export class PercentageSplitStrategy implements SplitStrategy {
  calculate(amount: number, memberIds: number[], details?: SplitDetail[]): SplitResult[] {
    if (!details || details.length === 0) {
      throw new ValidationError("Percentage split requires percentage details for each member")
    }

    const filteredDetails = details.filter((detail) => memberIds.includes(detail.userId))

    if (filteredDetails.length !== memberIds.length) {
      throw new ValidationError("Percentage split requires a value for every group member")
    }

    const totalPercentage = filteredDetails.reduce((sum, d) => sum + (d.percentage ?? 0), 0)

    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new ValidationError(`Percentages must sum to 100, got ${totalPercentage}`)
    }

    const results: SplitResult[] = []
    let allocated = 0

    filteredDetails.forEach((d, index) => {
      if (index === filteredDetails.length - 1) {
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
