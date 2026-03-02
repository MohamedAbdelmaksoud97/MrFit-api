import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { IHasher } from "../../domain/interfaces/IHasher";
import { AppError } from "../../../../shared/domain/errors/AppError";
import { User } from "../../domain/entities/User";

import { Password } from "../../domain/valueObjects/Password";

export class UpdatePassword {
  constructor(
    private userRepository: IUserRepository,
    private hasher: IHasher,
  ) {}

  async execute(
    user: User,
    currentPassword: string,
    newPassword: string,
    newPasswordConfirmation: string,
  ): Promise<void> {
    if (newPassword !== newPasswordConfirmation) {
      throw new AppError("New passwords do not match.", 400);
    }

    const validatedPassword = Password.create(newPassword);

    const isMatch = await this.hasher.compare(currentPassword, user.getPassword());
    if (!isMatch) {
      throw new AppError("The current password you entered is incorrect.", 401);
    }

    const newPasswordHash = await this.hasher.hash(validatedPassword.getValue());
    user.setPassword(newPasswordHash);

    await this.userRepository.save(user);
  }
}
