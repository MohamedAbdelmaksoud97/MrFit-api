"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTAccessTokenService = exports.JwtTokenEmailVerificationService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtTokenEmailVerificationService {
    secret = process.env.JWT_SECRET || "fallback_secret";
    expiresIn = process.env.JWT_EXPIRES_IN || "24h";
    async generateToken(userId) {
        return jsonwebtoken_1.default.sign({ sub: userId, type: "activation" }, // أضفنا النوع هنا
        this.secret, { expiresIn: this.expiresIn });
    }
    async verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.secret);
        }
        catch {
            return null;
        }
    }
}
exports.JwtTokenEmailVerificationService = JwtTokenEmailVerificationService;
class JWTAccessTokenService {
    secret = process.env.JWT_SECRET || "fallback_secret";
    expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
    async generateToken(userId) {
        return jsonwebtoken_1.default.sign({ sub: userId, type: "access" }, this.secret, {
            expiresIn: this.expiresIn,
        });
    }
    async verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.secret);
        }
        catch {
            return null;
        }
    }
}
exports.JWTAccessTokenService = JWTAccessTokenService;
