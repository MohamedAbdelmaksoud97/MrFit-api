import { v4 as uuidv4 } from "uuid";
import { AppError } from "../../../../shared/domain/errors/AppError";
// 1. كلاس فرعي لبيانات الجسم (Value Object)
export class UserProfile {
  constructor(
    public readonly age: number,
    public readonly height: number,
    public readonly gender: "Male" | "Female",
    public readonly fitnessLevel: "Beginner" | "Intermediate" | "Advanced",
    public readonly weight: number,
    public readonly goal: "Losing Weight" | "Building Muscle" | "Maintenance",
    public readonly fatPercentage?: number,
    public readonly budgetLevel?: "Economic" | "Average" | "High",
  ) {
    if (age < 15) {
      throw new AppError("Application is only for individuals over 15 years old", 400);
    }

    if (weight <= 0) {
      throw new AppError("Weight must be a positive number", 400);
    }

    if (height <= 0) {
      throw new AppError("Height must be a positive number", 400);
    }

    if (fatPercentage !== undefined && (fatPercentage < 0 || fatPercentage > 100)) {
      throw new AppError("Fat percentage must be between 0 and 100", 400);
    }

    const validFitnessLevels = ["Beginner", "Intermediate", "Advanced"];
    if (!validFitnessLevels.includes(fitnessLevel)) {
      throw new AppError(
        `Invalid fitness level. Must be one of: ${validFitnessLevels.join(", ")}`,
        400,
      );
    }

    const validGoals = ["Losing Weight", "Building Muscle", "Maintenance"];
    if (!validGoals.includes(goal)) {
      throw new AppError(`Invalid goal. Must be one of: ${validGoals.join(", ")}`, 400);
    }

    if (budgetLevel && !["Economic", "Average", "High"].includes(budgetLevel)) {
      throw new AppError("Invalid budget level provided", 400);
    }
  }
}

export class User {
  private id: string;
  private username: string;
  private email: string;
  private passwordHash: string;
  private isVerified: boolean = false; // حالة التحقق من الإيميل
  private passwordUpdatedAt: Date;
  private profile: UserProfile; // استخدام الـ Composition هنا

  constructor(
    username: string,
    email: string,
    passwordHash: string,
    profile: UserProfile,
    id?: string,
    passwordUpdatedAt?: Date,
  ) {
    this.id = id || uuidv4();
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.passwordUpdatedAt = passwordUpdatedAt || new Date();
    this.profile = profile;
  }

  // Getters
  public getProfile() {
    return this.profile;
  }
  public setProfile(newProfile: UserProfile) {
    this.profile = newProfile;
  }
  public getEmail() {
    return this.email;
  }
  public getName() {
    return this.username;
  }
  public getPassword() {
    return this.passwordHash;
  }
  public getId() {
    return this.id;
  }
  public setVerified(status: boolean) {
    this.isVerified = status;
  }
  public getVerificationStatus() {
    return this.isVerified;
  }
  public setPassword(newPasswordHash: string) {
    this.passwordHash = newPasswordHash;
  }
  public getPasswordUpdatedAt() {
    return this.passwordUpdatedAt;
  }
  public setPasswordUpdatedAt(date: Date) {
    this.passwordUpdatedAt = date;
  }

  // Business Logic: تحديث بيانات الجسم
  public updateBodyStats(newWeight: number, newFat?: number): void {
    // بنعمل Copy من البروفايل القديم مع تحديث الوزن
    this.profile = new UserProfile(
      this.profile.age,
      this.profile.height,
      this.profile.gender,
      this.profile.fitnessLevel,
      newWeight,
      this.profile.goal,
      newFat,
      this.profile.budgetLevel,
    );
  }
}
