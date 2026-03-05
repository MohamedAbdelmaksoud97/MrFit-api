import express, { Request, Response } from "express";
import "dotenv/config";
import { userRouter } from "./routes/userRoutes";
import { globalErrorHandler } from "./modules/user/presentation/middlewares/ErrorHandler";
import nutritionRouter from "./modules/nutrition/routes/nutritionRoutes";
import { workoutRouter } from "./modules/workout/routes/workoutRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Express + TypeScript is running 🚀" });
});

app.use("/api/users", userRouter);
app.use("/api/nutrition", nutritionRouter);
app.use("/api/workout", workoutRouter);

app.use(globalErrorHandler);

// التعامل مع الأخطاء خارج Express (مثل رفض الوعد Unhandled Rejection)
process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Serverrr running on http://localhost:${PORT}`);
});
