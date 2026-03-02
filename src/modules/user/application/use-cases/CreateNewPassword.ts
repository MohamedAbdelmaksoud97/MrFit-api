import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { ITokenService } from "../../domain/interfaces/ITokenService";
import { IHasher } from "../../domain/interfaces/IHasher";
import { AppError } from "../../../../shared/domain/errors/AppError";
// 1. Import your Password Value Object
import { Password } from "../../domain/valueObjects/Password";

export class CreateNewPassword {
  constructor(
    private userRepository: IUserRepository,
    private tokenService: ITokenService,
    private hasher: IHasher,
  ) {}

  async execute(
    token: string,
    newPassword: string,
    newPasswordConfirmation: string,
  ): Promise<void> {
    // 2. Cross-check Confirmation (Business Logic)
    if (newPassword !== newPasswordConfirmation) {
      throw new AppError("Passwords do not match.", 400);
    }

    // 3. Enforce Complexity via Value Object (The Domain Rule)
    // This will throw an AppError if the password is < 8 chars, lacks uppercase, etc.
    const securePassword = Password.create(newPassword);

    // 4. Token Verification
    const payload = await this.tokenService.verifyToken(token);

    if (!payload || !payload.sub) {
      throw new AppError("Invalid or expired reset token.", 401);
    }

    // 5. User Existence Check
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new AppError("User no longer exists.", 404);
    }

    // 6. Hashing & Updating (The Secure Flow)
    const newPasswordHash = await this.hasher.hash(securePassword.getValue());

    user.setPassword(newPasswordHash);

    await this.userRepository.save(user);
  }
}
