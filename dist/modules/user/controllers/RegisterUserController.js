"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserController = void 0;
const CatchAsync_1 = require("../../../shared/domain/errors/CatchAsync");
class RegisterUserController {
    registerUserUseCase;
    constructor(registerUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
    }
    register = (0, CatchAsync_1.catchAsync)(async (req, res, next) => {
        // مش محتاجين try/catch هنا خالص!
        const registerUserDTO = req.body;
        const result = await this.registerUserUseCase.execute(registerUserDTO);
        return res.status(201).json({
            success: true,
            data: result,
        });
    });
}
exports.RegisterUserController = RegisterUserController;
