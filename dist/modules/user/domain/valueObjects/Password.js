"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
// src/modules/user/domain/value-objects/Password.ts
const AppError_1 = require("../../../../shared/domain/errors/AppError");
class Password {
    value;
    constructor(value) {
        this.validate(value);
        this.value = value;
    }
    // Factory Method
    static create(plainText) {
        return new Password(plainText);
    }
    // The Domain Rules (In English with AppError)
    validate(value) {
        if (!value || value.length < 8) {
            throw new AppError_1.AppError("Password must be at least 8 characters long", 400);
        }
        if (!/[A-Z]/.test(value)) {
            throw new AppError_1.AppError("Password must contain at least one uppercase letter", 400);
        }
        if (!/\d/.test(value)) {
            throw new AppError_1.AppError("Password must contain at least one number", 400);
        }
        // Optional: Add special character check
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            throw new AppError_1.AppError("Password must contain at least one special character", 400);
        }
    }
    getValue() {
        return this.value;
    }
}
exports.Password = Password;
