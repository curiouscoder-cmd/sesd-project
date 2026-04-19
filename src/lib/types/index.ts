export interface AuthPayload {
  userId: number
  email: string
}

export type SplitTypeName = "EQUAL" | "EXACT" | "PERCENTAGE"

export interface SplitDetail {
  userId: number
  amount?: number
  percentage?: number
}

export interface BalanceEntry {
  userId: number
  name: string
  email: string
  balance: number
}

export interface GroupBalanceSummary extends BalanceEntry {
  groupId: number
  groupName: string
}
