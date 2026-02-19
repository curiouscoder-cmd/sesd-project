import { SplitDetail } from "@/lib/types"

export interface SplitResult {
  userId: number
  amount: number
}

export interface SplitStrategy {
  calculate(amount: number, memberIds: number[], details?: SplitDetail[]): SplitResult[]
}
