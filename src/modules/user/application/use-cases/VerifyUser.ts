import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { ITokenService, TokenPayload } from "../../domain/interfaces/ITokenService";
import { AppError } from "../../../../shared/domain/errors/AppError";

export class VerifyUser {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: ITokenService,
  ) {}

  async execute(token: string): Promise<void> {
    const payload = (await this.tokenService.verifyToken(token)) as TokenPayload | null;

    if (!payload || !payload.sub) {
      throw new AppError("Invalid or expired activation link.", 401);
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    if (user.getVerificationStatus()) {
      throw new AppError("Account is already verified. Please log in.", 400);
    }

    user.setVerified(true);
    await this.userRepository.save(user);
  }
}
