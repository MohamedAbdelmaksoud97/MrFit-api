import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { User as UserEntity, UserProfile } from "../../domain/entities/User";
import { UserModel } from "../persistence/UserSchema"; // موديل المونجوس بتاعك

export class MongooseUserRepository implements IUserRepository {
  // 1. تحويل من Domain Entity إلى Database Document (Mapping)
  async save(user: UserEntity): Promise<void> {
    const userProfile = user.getProfile();

    const userData = {
      username: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      profile: {
        age: userProfile.age,
        height: userProfile.height,
        weight: userProfile.weight,
        goal: userProfile.goal,
        fatPercentage: userProfile.fatPercentage,
        budgetLevel: userProfile.budgetLevel,
      },
    };

    //findOneAndUpdate بتعمل Save لو جديد وتعمل Update لو موجود (Upsert)
    await UserModel.findOneAndUpdate({ email: user.getEmail() }, userData, {
      upsert: true,
      new: true,
    });
  }

  // 2. تحويل من Database Document إلى Domain Entity (Mapping)
  async findByEmail(email: string): Promise<UserEntity | null> {
    const userDoc = await UserModel.findOne({ email }).select("+password");
    if (!userDoc) return null;

    // بنرجع كائن الـ Entity "نظيف" لطبقة الـ Domain
    return new UserEntity(
      userDoc.username,
      userDoc.email,
      userDoc.password,
      new UserProfile(
        userDoc.profile?.age ?? 0,
        userDoc.profile?.height ?? 0,
        userDoc.profile?.weight ?? 0,
        userDoc.profile?.goal || "Maintenance",
        userDoc.profile?.fatPercentage ?? 0,
        userDoc.profile?.budgetLevel || "Average",
      ),
      userDoc._id.toString(),
    );
  }

  async exists(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email });
    return count > 0;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const userDoc = await UserModel.findById(id);
    if (!userDoc) return null;
    // ... نفس التحويل اللي فوق لـ Entity
    return null; // (للاختصار)
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }
}
