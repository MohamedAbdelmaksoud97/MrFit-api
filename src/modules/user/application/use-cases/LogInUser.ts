import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { IHasher } from "../../domain/interfaces/IHasher";
import { ITokenService } from "../../domain/interfaces/ITokenService";
import { AppError } from "../../../../shared/domain/errors/AppError";

export class LogInUser {
  constructor(
    private userRepository: IUserRepository,
    private hasher: IHasher,
    private tokenService: ITokenService,
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await this.hasher.compare(password, user.getPassword());
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!user.getVerificationStatus()) {
      throw new AppError("Please activate your account first. Check your email.", 403);
    }

    const token = await this.tokenService.generateToken(user.getId());

    return token;
  }
}
