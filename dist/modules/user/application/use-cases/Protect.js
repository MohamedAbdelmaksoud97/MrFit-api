"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Protect = void 0;
const AppError_1 = require("../../../../shared/domain/errors/AppError");
class Protect {
    tokenService;
    userRepository;
    constructor(tokenService, userRepository) {
        this.tokenService = tokenService;
        this.userRepository = userRepository;
    }
    async validateAndGetUser(token) {
        // 1. التحقق من صحة التوكن
        const payload = await this.tokenService.verifyToken(token);
        // لو التوكن منتهي أو ملعوب فيه، بنرمي 401 (Unauthorized)
        if (!payload || !payload.sub) {
            throw new AppError_1.AppError("Invalid or expired token. Please log in again.", 401);
        }
        // 2. التأكد إن صاحب التوكن لسه موجود في الداتابيز
        const user = await this.userRepository.findById(payload.sub);
        const iat = payload.iat;
        console.log(iat * 1000, user?.getPasswordUpdatedAt().getTime());
        if (user && user.getPasswordUpdatedAt().getTime() > iat * 1000) {
            throw new AppError_1.AppError("Token is invalid due to password change. Please log in again.", 401);
        }
        console.log(user);
        if (!user) {
            throw new AppError_1.AppError("The user belonging to this token no longer exists.", 401);
        }
        // 3. (إضافي) ممكن نتأكد هنا لو اليوزر غير الباسورد بعد صدور التوكن ده (Security Bonus)
        return user;
    }
}
exports.Protect = Protect;
