import { LoginUserDto, RegisterUserDto } from "@/lib/dto"
import { UserRepository } from "@/lib/repositories/UserRepository"
import { ConflictError, NotFoundError, UnauthorizedError } from "@/lib/utils"
import { signToken } from "@/lib/utils/jwt"
import { hashPassword, verifyPassword } from "@/lib/utils/password"

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(input: RegisterUserDto) {
    const existingUser = await this.userRepository.findByEmail(input.email)

    if (existingUser) {
      throw new ConflictError("An account with this email already exists")
    }

    const hashedPassword = await hashPassword(input.password)

    return this.userRepository.createUser({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    })
  }

  async login(input: LoginUserDto) {
    const user = await this.userRepository.findByEmail(input.email)

    if (!user) {
      throw new UnauthorizedError("Invalid email or password")
    }

    const isPasswordValid = await verifyPassword(input.password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password")
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

  async getMe(userId: number) {
    const user = await this.userRepository.findPublicById(userId)

    if (!user) {
      throw new NotFoundError("User not found")
    }

    return user
  }
}
