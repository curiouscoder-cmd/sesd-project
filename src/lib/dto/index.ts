import { SplitDetail, SplitTypeName } from "@/lib/types"
import { ValidationError } from "@/lib/utils"

type RequestBody = Record<string, unknown>

function toBody(body: unknown): RequestBody {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ValidationError("Invalid request body")
  }

  return body as RequestBody
}

function getTextValue(value: unknown, fieldName: string) {
  if (typeof value !== "string") {
    throw new ValidationError(`${fieldName} is required`)
  }

  const trimmedValue = value.trim()

  if (!trimmedValue) {
    throw new ValidationError(`${fieldName} is required`)
  }

  return trimmedValue
}

function getEmailValue(value: unknown) {
  const email = getTextValue(value, "Email").toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format")
  }

  return email
}

function getNumberValue(value: unknown, fieldName: string) {
  const parsedValue = typeof value === "number" ? value : Number(value)

  if (Number.isNaN(parsedValue)) {
    throw new ValidationError(`${fieldName} must be a number`)
  }

  return parsedValue
}

function getPositiveNumberValue(value: unknown, fieldName: string) {
  const parsedValue = getNumberValue(value, fieldName)

  if (parsedValue <= 0) {
    throw new ValidationError(`${fieldName} must be greater than 0`)
  }

  return parsedValue
}

function getIntegerValue(value: unknown, fieldName: string) {
  const parsedValue = getNumberValue(value, fieldName)

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new ValidationError(`Invalid ${fieldName.toLowerCase()}`)
  }

  return parsedValue
}

export class RouteNumberDto {
  static from(value: string, fieldName: string) {
    return getIntegerValue(value, fieldName)
  }
}

export class RegisterUserDto {
  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string
  ) {}

  static from(body: unknown) {
    const parsedBody = toBody(body)
    const name = getTextValue(parsedBody.name, "Name")
    const email = getEmailValue(parsedBody.email)
    const password = getTextValue(parsedBody.password, "Password")

    if (password.length < 6) {
      throw new ValidationError("Password must be at least 6 characters")
    }

    return new RegisterUserDto(name, email, password)
  }
}

export class LoginUserDto {
  private constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  static from(body: unknown) {
    const parsedBody = toBody(body)
    const email = getEmailValue(parsedBody.email)
    const password = getTextValue(parsedBody.password, "Password")

    return new LoginUserDto(email, password)
  }
}

export class CreateGroupDto {
  private constructor(public readonly name: string) {}

  static from(body: unknown) {
    const parsedBody = toBody(body)
    return new CreateGroupDto(getTextValue(parsedBody.name, "Group name"))
  }
}

export class UpdateGroupDto {
  private constructor(public readonly name: string) {}

  static from(body: unknown) {
    const parsedBody = toBody(body)
    return new UpdateGroupDto(getTextValue(parsedBody.name, "Group name"))
  }
}

export class AddMemberDto {
  private constructor(public readonly email: string) {}

  static from(body: unknown) {
    const parsedBody = toBody(body)
    return new AddMemberDto(getEmailValue(parsedBody.email))
  }
}

export class CreateExpenseDto {
  private constructor(
    public readonly description: string,
    public readonly amount: number,
    public readonly paidById: number,
    public readonly groupId: number,
    public readonly splitType: SplitTypeName,
    public readonly splits?: SplitDetail[]
  ) {}

  static from(body: unknown) {
    const parsedBody = toBody(body)
    const description = getTextValue(parsedBody.description, "Description")
    const amount = getPositiveNumberValue(parsedBody.amount, "Amount")
    const paidById = getIntegerValue(parsedBody.paidById, "Paid by ID")
    const groupId = getIntegerValue(parsedBody.groupId, "Group ID")
    const splitType = this.getSplitType(parsedBody.splitType)
    const splits = this.getSplits(parsedBody.splits)

    return new CreateExpenseDto(description, amount, paidById, groupId, splitType, splits)
  }

  private static getSplitType(value: unknown): SplitTypeName {
    if (value !== "EQUAL" && value !== "EXACT" && value !== "PERCENTAGE") {
      throw new ValidationError("Invalid split type")
    }

    return value
  }

  private static getSplits(value: unknown) {
    if (value === undefined) {
      return undefined
    }

    if (!Array.isArray(value)) {
      throw new ValidationError("Splits must be an array")
    }

    return value.map((item) => {
      const parsedItem = toBody(item)

      return {
        userId: getIntegerValue(parsedItem.userId, "User ID"),
        amount: parsedItem.amount === undefined ? undefined : getPositiveNumberValue(parsedItem.amount, "Amount"),
        percentage:
          parsedItem.percentage === undefined
            ? undefined
            : getPositiveNumberValue(parsedItem.percentage, "Percentage"),
      }
    })
  }
}

export class CreateSettlementDto {
  private constructor(
    public readonly groupId: number,
    public readonly paidToId: number,
    public readonly amount: number
  ) {}

  static from(body: unknown) {
    const parsedBody = toBody(body)
    const groupId = getIntegerValue(parsedBody.groupId, "Group ID")
    const paidToId = getIntegerValue(parsedBody.paidToId, "Paid to ID")
    const amount = getPositiveNumberValue(parsedBody.amount, "Amount")

    return new CreateSettlementDto(groupId, paidToId, amount)
  }
}

export class EmailQueryDto {
  private constructor(public readonly email: string) {}

  static from(value: string | null) {
    if (!value) {
      throw new ValidationError("email query param is required")
    }

    return new EmailQueryDto(getEmailValue(value))
  }
}
