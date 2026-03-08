import { v4 as uuidv4 } from "uuid";
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
    if (age < 15) throw new Error("التطبيق مخصص للأفراد فوق 15 سنة");
  }
}

// 2. كلاس اليوزر الأساسي
export class User {
  private id: string;
  private username: string;
  private email: string;
  private passwordHash: string;
  private isVerified: boolean = false; // حالة التحقق من الإيميل
  private profile: UserProfile; // استخدام الـ Composition هنا

  constructor(
    username: string,
    email: string,
    passwordHash: string,
    profile: UserProfile,
    id?: string,
  ) {
    this.id = id || uuidv4();
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.profile = profile;
  }

  // Getters
  public getProfile() {
    return this.profile;
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
