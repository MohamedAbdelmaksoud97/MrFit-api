import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { ITokenService } from "../../domain/interfaces/ITokenService";
import { IMailService } from "../../domain/interfaces/IMailService";
import { AppError } from "../../../../shared/domain/errors/AppError";

export class ResendVerificationEmail {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: ITokenService,
    private emailSender: IMailService,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("No user found with this email address.", 404);
    }

    if (user.getVerificationStatus()) {
      throw new AppError("This account is already verified. Please log in.", 400);
    }

    const token = await this.tokenService.generateToken(user.getId());

    await this.emailSender.sendActivationEmail(email, token);
  }
}
