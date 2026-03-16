"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTheActivePlan = void 0;
class GetTheActivePlan {
    nutritionRepository;
    userRepository;
    constructor(nutritionRepository, userRepository) {
        this.nutritionRepository = nutritionRepository;
        this.userRepository = userRepository;
    }
    execute(userId) {
        return this.nutritionRepository.getActivePlanByUserId(userId);
    }
}
exports.GetTheActivePlan = GetTheActivePlan;
