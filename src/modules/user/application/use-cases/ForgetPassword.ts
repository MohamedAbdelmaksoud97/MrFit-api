import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { ITokenService } from "../../domain/interfaces/ITokenService";
import { IMailService } from "../../domain/interfaces/IMailService";
import { AppError } from "../../../../shared/domain/errors/AppError";

export class ForgetPassword {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: ITokenService,
    private mailService: IMailService,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("No user found with that email address.", 404);
    }

    const resetToken = await this.tokenService.generateToken(user.getId());

    await this.mailService.sendActivationEmail(email, resetToken);
  }
}
