"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const uri = process.env.MONGODB_URI?.replace("<PASSWORD>", process.env.DATABASE_PASSWORD || "your_db_password");
    try {
        const conn = await mongoose_1.default.connect(uri);
        console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`❌ Connection Error: ${error.message}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
