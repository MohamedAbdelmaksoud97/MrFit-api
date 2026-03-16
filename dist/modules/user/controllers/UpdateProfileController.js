"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileController = void 0;
const CatchAsync_1 = require("../../../shared/domain/errors/CatchAsync");
class UpdateProfileController {
    updateProfileUseCase;
    constructor(updateProfileUseCase) {
        this.updateProfileUseCase = updateProfileUseCase;
    }
    excute = (0, CatchAsync_1.catchAsync)(async (req, res, next) => {
        const user = req.user; // تأكد من أن المستخدم موجود في الطلب
        const fieldsToUpdate = req.body; // الحقول التي سيتم تحديثها
        console.log(fieldsToUpdate, "==============================");
        await this.updateProfileUseCase.execute(user, fieldsToUpdate);
        res.status(200).json({ message: "Profile updated successfully" });
    });
}
exports.UpdateProfileController = UpdateProfileController;
