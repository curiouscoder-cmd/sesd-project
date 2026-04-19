import { UserRepository } from "@/lib/repositories/UserRepository"
import { NotFoundError } from "@/lib/utils"

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findPublicByEmail(email)

    if (!user) {
      throw new NotFoundError("User not found")
    }

    return user
  }
}
