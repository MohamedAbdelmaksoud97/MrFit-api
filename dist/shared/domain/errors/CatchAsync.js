"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = void 0;
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next); // أي خطأ يروح للـ Global Error Handler
    };
};
exports.catchAsync = catchAsync;
