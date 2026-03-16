"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptHasher = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class BcryptHasher {
    saltRounds = 10;
    async hash(password) {
        return await bcrypt_1.default.hash(password, this.saltRounds);
    }
    // ميثود إضافية هنحتاجها في الـ Login مستقبلاً
    async compare(password, hash) {
        return await bcrypt_1.default.compare(password, hash);
    }
}
exports.BcryptHasher = BcryptHasher;
