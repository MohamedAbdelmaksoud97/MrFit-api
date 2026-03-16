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

// 1. Security & Trust Proxy
app.set("trust proxy", 1);
app.disable("x-powered-by");

// 2. Helmet with CSP for Production
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "connect-src": ["'self'", "https://api.mrfit-app.com", "http://localhost:3000"],
      },
    },
  }),
);

// 3. CORS Configuration
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

// 4. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});
app.use("/api", limiter);

// 5. Body Parsers & Static Files
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(compression());

// --- Define Frontend Path ---
// استخدام process.cwd() يضمن الوصول لمجلد dist في الـ Root دائماً
const FRONTEND_BUILD_PATH = path.resolve(process.cwd(), "dist");
app.use(express.static(FRONTEND_BUILD_PATH));

// 6. Data Sanitization (NoSQL injection & XSS)
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

// 7. API Routes
app.use("/api/users", userRouter);
app.use("/api/nutrition", nutritionRouter);
app.use("/api/workout", workoutRouter);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

// 8. Frontend Catch-all (Must be AFTER API routes)
app.get(/^(?!\/api).*/, (req: Request, res: Response) => {
  res.sendFile(path.join(FRONTEND_BUILD_PATH, "index.html"), (err) => {
    if (err) {
      console.error("❌ Error sending index.html:", err);
      res.status(404).send("Frontend build not found.");
    }
  });
});

// 9. Global Error Handler
app.use(globalErrorHandler);

// 10. Start Server
const startServer = async () => {
  try {
    await connectDB();
    console.log("📁 Database connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`🚀 MrFit Server running on http://localhost:${PORT}`);
    });

    // Error Handling for Uncaught Rejections
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
