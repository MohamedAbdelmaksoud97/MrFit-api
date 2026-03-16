"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const CatchAsync_1 = require("../../../shared/domain/errors/CatchAsync");
const EntityToResponseConverter_1 = require("../application/mappers/EntityToResponseConverter");
const AppError_1 = require("../../../shared/domain/errors/AppError");
class ProfileController {
    getProfile = (0, CatchAsync_1.catchAsync)(async (req, res, next) => {
        const userEntity = req.user;
        if (!userEntity) {
            throw new AppError_1.AppError("User not found in request context", 404);
        }
        const userDTO = EntityToResponseConverter_1.EntityToResponseConverter.toDTO(userEntity);
        return res.status(200).json({
            success: true,
            data: userDTO,
        });
    });
}
exports.ProfileController = ProfileController;
