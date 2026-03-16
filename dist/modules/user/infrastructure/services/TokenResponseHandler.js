"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenResponseHandler = void 0;
class TokenResponseHandler {
    static send(res, token, message = "Success") {
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000,
        });
        res.set("Authorization", `Bearer ${token}`);
        return res.status(200).json({
            success: true,
            message,
            token,
        });
    }
}
exports.TokenResponseHandler = TokenResponseHandler;
