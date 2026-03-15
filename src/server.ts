import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import compression from "compression";
import xssLib from "xss";

import { userRouter } from "./routes/userRoutes";
import nutritionRouter from "./modules/nutrition/routes/nutritionRoutes";
import { workoutRouter } from "./modules/workout/routes/workoutRoutes";
import { globalErrorHandler } from "./modules/user/presentation/middlewares/ErrorHandler";
import { connectDB } from "./shared/infrastructure/dataBase/mongo-db";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : ["http://localhost:5173", "http://localhost:8081"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 600,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(compression());

function stripNoSQLOps(obj: any): void {
  if (!obj || typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    obj.forEach(stripNoSQLOps);
  } else {
    for (const key of Object.keys(obj)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else if (obj[key] && typeof obj[key] === "object") {
        stripNoSQLOps(obj[key]);
      }
    }
  }
}

function mutateSanitize(obj: any): void {
  if (!obj || typeof obj !== "object") return;

  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === "string") {
      obj[key] = xssLib(val);
    } else if (val && typeof val === "object") {
      mutateSanitize(val);
    }
  }
}

app.use((req: Request, _res: Response, next: NextFunction) => {
  const targets = [req.body, req.query, req.params];

  targets.forEach((target) => {
    if (target) {
      stripNoSQLOps(target);
      mutateSanitize(target);
    }
  });

  next();
});

app.use("/api/users", userRouter);
app.use("/api/nutrition", nutritionRouter);
app.use("/api/workout", workoutRouter);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await connectDB();
    console.log("📁 Database connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`🚀 MrFit Server running on http://localhost:${PORT}`);
    });

    process.on("unhandledRejection", (err: Error) => {
      console.error("UNHANDLED REJECTION! 💥 Shutting down...");
      console.error(err.name, err.message);
      server.close(() => process.exit(1));
    });
    process.on("uncaughtException", (err: Error) => {
      console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
      console.error(err.name, err.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
