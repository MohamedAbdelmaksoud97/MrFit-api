"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfile = void 0;
const User_1 = require("../../domain/entities/User");
const AppError_1 = require("../../../../shared/domain/errors/AppError");
class UpdateProfile {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute(user, fieldsToUpdate) {
        const userToUpdate = await this.userRepo.findById(user.getId());
        if (!userToUpdate) {
            throw new AppError_1.AppError("User not found", 404);
        }
        const currentProfile = userToUpdate.getProfile();
        const updatedProfile = new User_1.UserProfile(currentProfile.age, fieldsToUpdate.height || currentProfile.height, currentProfile.gender, fieldsToUpdate.fitnessLevel || currentProfile.fitnessLevel, fieldsToUpdate.weight || currentProfile.weight, fieldsToUpdate.goal || currentProfile.goal, currentProfile.fatPercentage, fieldsToUpdate.budgetLevel || currentProfile.budgetLevel);
        userToUpdate.setProfile(updatedProfile);
        await this.userRepo.save(userToUpdate);
    }
}
exports.UpdateProfile = UpdateProfile;
