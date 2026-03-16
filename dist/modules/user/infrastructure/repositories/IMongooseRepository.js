"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoUserRepository = void 0;
const User_1 = require("../../domain/entities/User");
const UserModel_1 = require("../models/UserModel");
class MongoUserRepository {
    async save(user) {
        const persistenceData = {
            username: user.getName(),
            _id: user.getId(),
            email: user.getEmail(),
            passwordHash: user.getPassword(),
            passwordUpdatedAt: user.getPasswordUpdatedAt(),
            isVerified: user.getVerificationStatus(),
            profile: user.getProfile(),
        };
        // Use findOneAndUpdate with upsert to handle both Create and Update
        await UserModel_1.UserModel.findOneAndUpdate({ email: user.getEmail() }, { $set: persistenceData }, { upsert: true, new: true });
    }
    async findByEmail(email) {
        const doc = await UserModel_1.UserModel.findOne({ email }).lean();
        if (!doc)
            return null;
        return this.mapToEntity(doc);
    }
    async findById(id) {
        console.log("Fetching user by ID:", id);
        const doc = await UserModel_1.UserModel.findOne({ _id: id }).lean();
        if (!doc)
            return null;
        return this.mapToEntity(doc);
    }
    async exists(email) {
        const count = await UserModel_1.UserModel.countDocuments({ email });
        return count > 0;
    }
    async delete(id) {
        await UserModel_1.UserModel.findByIdAndDelete(id);
    }
    /**
     * Helper method to map the Mongoose Document to the Domain Entity.
     * This isolates the Database details from the User Entity.
     */
    mapToEntity(doc) {
        const profile = new User_1.UserProfile(doc.profile.age, doc.profile.height, doc.profile.gender, doc.profile.fitnessLevel, doc.profile.weight, doc.profile.goal, doc.profile.fatPercentage, doc.profile.budgetLevel);
        const user = new User_1.User(doc.username, doc.email, doc.passwordHash, profile, doc._id.toString(), // Convert MongoDB ObjectId to string for our Entity
        doc.passwordUpdatedAt);
        user.setVerified(doc.isVerified);
        return user;
    }
}
exports.MongoUserRepository = MongoUserRepository;
