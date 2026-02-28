import prisma from "@/lib/db"
import { hashPassword, verifyPassword } from "@/lib/utils/password"
import { signToken } from "@/lib/utils/jwt"
import { RegisterInput, LoginInput } from "@/lib/types"

export class AuthService {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    })

    if (existing) {
      throw new Error("An account with this email already exists")
    }

    const hashed = await hashPassword(input.password)

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashed,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    return user
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    })

    if (!user) {
      throw new Error("Invalid email or password")
    }

    const valid = await verifyPassword(input.password, user.password)

    if (!valid) {
      throw new Error("Invalid email or password")
    }

    const token = await signToken({ userId: user.id, email: user.email })

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    }
  }
}
