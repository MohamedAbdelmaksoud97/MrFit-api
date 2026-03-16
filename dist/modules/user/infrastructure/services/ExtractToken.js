"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractToken = void 0;
class ExtractToken {
    static fromHeaderOrCookie(req) {
        // 1. محاولة الاستخراج من الـ Authorization Header (Bearer Token)
        const authHeader = req.headers["authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
            return authHeader.split(" ")[1];
        }
        // 2. محاولة الاستخراج من الكوكيز (لو مستخدم cookie-parser)
        if (req.cookies && req.cookies.access_token) {
            return req.cookies.access_token;
        }
        // 3. محاولة الاستخراج من الـ Raw Cookies (كخطة بديلة لو مفيش parser)
        const rawCookies = req.headers.cookie;
        if (rawCookies) {
            // بحث بسيط عن access_token= داخل الـ string
            const match = rawCookies.match(/access_token=([^;]+)/);
            if (match)
                return match[1];
        }
        return null;
    }
}
exports.ExtractToken = ExtractToken;
