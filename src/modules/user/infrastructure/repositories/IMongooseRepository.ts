// src/modules/user/infrastructure/repositories/MongoUserRepository.ts
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { User, UserProfile } from "../../domain/entities/User";
import { UserModel } from "../models/UserModel";

export class MongoUserRepository implements IUserRepository {
  async save(user: User): Promise<void> {
    const persistenceData = {
      username: user.getName(),
      _id: user.getId(),
      email: user.getEmail(),
      passwordHash: user.getPassword(),
      isVerified: user.getVerificationStatus(),
      profile: user.getProfile(),
    };

    // Use findOneAndUpdate with upsert to handle both Create and Update
    await UserModel.findOneAndUpdate(
      { email: user.getEmail() },
      { $set: persistenceData },
      { upsert: true, new: true },
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).lean();
    if (!doc) return null;

    return this.mapToEntity(doc);
  }

  async findById(id: string): Promise<User | null> {
    console.log("Fetching user by ID:", id);
    const doc = await UserModel.findOne({ _id: id }).lean();

    if (!doc) return null;

    return this.mapToEntity(doc);
  }

  async exists(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email });
    return count > 0;
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  /**
   * Helper method to map the Mongoose Document to the Domain Entity.
   * This isolates the Database details from the User Entity.
   */
  private mapToEntity(doc: any): User {
    const profile = new UserProfile(
      doc.profile.age,
      doc.profile.height,
      doc.profile.gender,
      doc.profile.fitnessLevel,
      doc.profile.weight,
      doc.profile.goal,
      doc.profile.fatPercentage,
      doc.profile.budgetLevel,
    );

    const user = new User(
      doc.username,
      doc.email,
      doc.passwordHash,
      profile,
      doc._id.toString(), // Convert MongoDB ObjectId to string for our Entity
    );

    user.setVerified(doc.isVerified);
    return user;
  }
}
