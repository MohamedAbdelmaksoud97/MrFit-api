// src/modules/user/domain/value-objects/Password.ts
import { AppError } from "../../../../shared/domain/errors/AppError";

export class Password {
  private readonly value: string;

  private constructor(value: string) {
    this.validate(value);
    this.value = value;
  }

  // Factory Method
  static create(plainText: string): Password {
    return new Password(plainText);
  }

  // The Domain Rules (In English with AppError)
  private validate(value: string): void {
    if (!value || value.length < 8) {
      throw new AppError("Password must be at least 8 characters long", 400);
    }

    if (!/[A-Z]/.test(value)) {
      throw new AppError("Password must contain at least one uppercase letter", 400);
    }

    if (!/\d/.test(value)) {
      throw new AppError("Password must contain at least one number", 400);
    }

    // Optional: Add special character check
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      throw new AppError("Password must contain at least one special character", 400);
    }
  }

  public getValue(): string {
    return this.value;
  }
}
