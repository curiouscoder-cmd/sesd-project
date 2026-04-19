import { EqualSplitStrategy } from "@/lib/strategies/EqualSplitStrategy"
import { ExactSplitStrategy } from "@/lib/strategies/ExactSplitStrategy"
import { PercentageSplitStrategy } from "@/lib/strategies/PercentageSplitStrategy"
import { SplitResult, SplitStrategy } from "@/lib/strategies/SplitStrategy"
import { SplitDetail, SplitTypeName } from "@/lib/types"
import { ValidationError } from "@/lib/utils"

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
      throw new ValidationError("Unknown split type")
    }

    return strategy.calculate(amount, memberIds, details)
  }
}
