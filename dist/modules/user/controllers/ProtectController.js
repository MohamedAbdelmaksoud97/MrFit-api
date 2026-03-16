"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtectController = void 0;
const ExtractToken_1 = require("../infrastructure/services/ExtractToken");
const CatchAsync_1 = require("../../../shared/domain/errors/CatchAsync");
const AppError_1 = require("../../../shared/domain/errors/AppError");
class ProtectController {
    protect;
    constructor(protect) {
        this.protect = protect;
    }
    execute = (0, CatchAsync_1.catchAsync)(async (req, res, next) => {
        const token = ExtractToken_1.ExtractToken.fromHeaderOrCookie(req);
        if (!token) {
            throw new AppError_1.AppError("You are not logged in! Please provide a token.", 401);
        }
        const user = await this.protect.validateAndGetUser(token);
        req.user = user;
        next();
    });
}
exports.ProtectController = ProtectController;
