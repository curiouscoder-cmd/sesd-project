export interface AuthPayload {
  userId: number
  email: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface CreateGroupInput {
  name: string
}

export interface AddMemberInput {
  email: string
}

export interface SplitDetail {
  userId: number
  amount?: number
  percentage?: number
}

export interface CreateExpenseInput {
  description: string
  amount: number
  paidById: number
  groupId: number
  splitType: "EQUAL" | "EXACT" | "PERCENTAGE"
  splits?: SplitDetail[]
}

export interface CreateSettlementInput {
  groupId: number
  paidToId: number
  amount: number
}

export interface BalanceEntry {
  userId: number
  name: string
  email: string
  balance: number
}
