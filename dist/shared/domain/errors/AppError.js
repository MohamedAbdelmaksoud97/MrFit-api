"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    message;
    statusCode;
    status;
    isOperational;
    constructor(message, statusCode = 400) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.statusCode = statusCode;
        // إذا بدأ الكود بـ 4 فهو fail، وإذا كان 5 فهو error
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        // بنعلم الخطأ ده إنه "تحت السيطرة"
        this.isOperational = true;
        // دي بتخلي الـ Stack Trace يشاور على المكان الصح للخطأ
        Error.captureStackTrace(this, this.constructor);
        // توافقية مع TypeScript
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.AppError = AppError;
