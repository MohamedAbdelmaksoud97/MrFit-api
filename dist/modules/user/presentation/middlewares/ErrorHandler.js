"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    // في التطوير (Development) بنبعت كل حاجة عشان نصلح الكود
    if (process.env.NODE_ENV === "development") {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err,
        });
    }
    // في الـ Production بنبعت بس الأخطاء الـ Operational
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    // لو خطأ برمجي غريب، بنخفي التفاصيل عن العميل
    console.error("ERROR 💥", err);
    return res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
    });
};
exports.globalErrorHandler = globalErrorHandler;
