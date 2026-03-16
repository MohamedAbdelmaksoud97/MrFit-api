"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const xss_1 = __importDefault(require("xss"));
const userRoutes_1 = require("./routes/userRoutes");
const nutritionRoutes_1 = __importDefault(require("./modules/nutrition/routes/nutritionRoutes"));
const workoutRoutes_1 = require("./modules/workout/routes/workoutRoutes");
const ErrorHandler_1 = require("./modules/user/presentation/middlewares/ErrorHandler");
const mongo_db_1 = require("./shared/infrastructure/dataBase/mongo-db");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(",")
        : ["http://localhost:5173", "http://localhost:8081"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 600,
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: "Too many requests, please try again later.",
});
app.use("/api", limiter);
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" }));
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
function stripNoSQLOps(obj) {
    if (!obj || typeof obj !== "object")
        return;
    if (Array.isArray(obj)) {
        obj.forEach(stripNoSQLOps);
    }
    else {
        for (const key of Object.keys(obj)) {
            if (key.startsWith("$") || key.includes(".")) {
                delete obj[key];
            }
            else if (obj[key] && typeof obj[key] === "object") {
                stripNoSQLOps(obj[key]);
            }
        }
    }
}
function mutateSanitize(obj) {
    if (!obj || typeof obj !== "object")
        return;
    for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (typeof val === "string") {
            obj[key] = (0, xss_1.default)(val);
        }
        else if (val && typeof val === "object") {
            mutateSanitize(val);
        }
    }
}
app.use((req, _res, next) => {
    const targets = [req.body, req.query, req.params];
    targets.forEach((target) => {
        if (target) {
            stripNoSQLOps(target);
            mutateSanitize(target);
        }
    });
    next();
});
app.use(express_1.default.static(path_1.default.join(__dirname, "../dist")));
app.use("/api/users", userRoutes_1.userRouter);
app.use("/api/nutrition", nutritionRoutes_1.default);
app.use("/api/workout", workoutRoutes_1.workoutRouter);
app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../dist/index.html"));
});
app.use(ErrorHandler_1.globalErrorHandler);
const startServer = async () => {
    try {
        await (0, mongo_db_1.connectDB)();
        console.log("📁 Database connected successfully");
        const server = app.listen(PORT, () => {
            console.log(`🚀 MrFit Server running on http://localhost:${PORT}`);
        });
        process.on("unhandledRejection", (err) => {
            console.error("UNHANDLED REJECTION! 💥 Shutting down...");
            console.error(err.name, err.message);
            server.close(() => process.exit(1));
        });
        process.on("uncaughtException", (err) => {
            console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
            console.error(err.name, err.message);
            process.exit(1);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
