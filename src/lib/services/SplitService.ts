import { SplitStrategy, SplitResult } from "@/lib/strategies/SplitStrategy"
import { EqualSplitStrategy } from "@/lib/strategies/EqualSplitStrategy"
import { ExactSplitStrategy } from "@/lib/strategies/ExactSplitStrategy"
import { PercentageSplitStrategy } from "@/lib/strategies/PercentageSplitStrategy"
import { SplitDetail } from "@/lib/types"

type SplitTypeName = "EQUAL" | "EXACT" | "PERCENTAGE"

export class SplitService {
  private strategies: Map<SplitTypeName, SplitStrategy>

  constructor() {
    this.strategies = new Map([
      ["EQUAL", new EqualSplitStrategy()],
      ["EXACT", new ExactSplitStrategy()],
      ["PERCENTAGE", new PercentageSplitStrategy()],
    ])
  }

  calculateSplits(
    amount: number,
    memberIds: number[],
    splitType: SplitTypeName,
    details?: SplitDetail[]
  ): SplitResult[] {
    const strategy = this.strategies.get(splitType)

    if (!strategy) {
      throw new Error(`Unknown split type: ${splitType}`)
    }

    return strategy.calculate(amount, memberIds, details)
  }
}
