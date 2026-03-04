import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { User as UserEntity } from "../../domain/entities/User";

export class FakeUserRepository implements IUserRepository {
  // المخزن الوهمي بتاعنا (Array في الميموري)
  private users: UserEntity[] = [];

  async save(user: UserEntity): Promise<void> {
    // لو اليوزر موجود بنحدثه، لو مش موجود بنضيفه
    const index = this.users.findIndex((u) => u.getEmail() === user.getEmail());
    if (index >= 0) {
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
    console.log("✅ [Fake DB]: User saved successfully!", user.getName());
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = this.users.find((u) => u.getEmail() === email);
    return user || null;
  }

  async exists(email: string): Promise<boolean> {
    return this.users.some((u) => u.getEmail() === email);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = this.users.find((u) => u.getId() === id);
    return user || null;
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((u) => u.getId() !== id);
  }
}
export const sharedUserRepository = new FakeUserRepository();
