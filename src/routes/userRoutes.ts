import { Router } from "express";
import { RegisterUserController } from "../modules/user/controllers/RegisterUserController";
import { RegisterUser } from "../modules/user/application/use-cases/RegisterUser";
//import { MongooseUserRepository } from "../modules/user/infrastructure/repositories/IMongooseRepository";
import {
  FakeUserRepository,
  sharedUserRepository,
} from "../modules/user/infrastructure/repositories/fakeRepository";
import { MongoUserRepository } from "../modules/user/infrastructure/repositories/IMongooseRepository";
import { BcryptHasher } from "../modules/user/infrastructure/hashers/BcryptHasher";

import { JwtTokenEmailVerificationService } from "../modules/user/infrastructure/services/JWTService";

import { FakeMailService } from "../modules/user/infrastructure/services/FakeMailService";
import { VerifyUserController } from "../modules/user/controllers/VerifyUserController";
import { VerifyUser } from "../modules/user/application/use-cases/VerifyUser";
import { LogInUserController } from "../modules/user/controllers/LogInUserController";
import { LogInUser } from "../modules/user/application/use-cases/LogInUser";
import { ProtectController } from "../modules/user/controllers/ProtectController";
import { Protect } from "../modules/user/application/use-cases/Protect";

import { CreateNewPassword } from "../modules/user/application/use-cases/CreateNewPassword";
import { CreateNewPasswordController } from "../modules/user/controllers/CreateNewPasswordController";
import { ForgetPasswordController } from "../modules/user/controllers/ForgetPasswordController";
import { ForgetPassword } from "../modules/user/application/use-cases/ForgetPassword";
import { UpdatePassword } from "../modules/user/application/use-cases/UpdatePassword";
import { UpdatePasswordController } from "../modules/user/controllers/UpdatePasswordController";
import { ResendVerificationEmailController } from "../modules/user/controllers/ResendVerificationEmailController";
import { ResendVerificationEmail } from "../modules/user/application/use-cases/ResendVerificationEmail";
import { ProfileController } from "../modules/user/controllers/ProfileController";
import { SendGridMailService } from "../modules/user/infrastructure/services/SendGridMailService";
const userRouter = Router();

// --- مرحلة تجميع الطبقات (The Assembly) ---

// 1. الأدوات التقنية (Infrastructure)
//const userRepository = new MongooseUserRepository();
const userRepository = new MongoUserRepository();

const hasher = new BcryptHasher();
const tokenService = new JwtTokenEmailVerificationService();
const emailSender = new SendGridMailService();
// 2. البزنس لوجيك (Application) - بنحقن فيه الأدوات
const registerUserUseCase = new RegisterUser(userRepository, hasher, tokenService, emailSender);

// 3. موظف الاستقبال (Presentation) - بنحقن فيه الـ Use Case
const registerUserController = new RegisterUserController(registerUserUseCase);
const verifyUserUseCase = new VerifyUser(userRepository, tokenService);
const verifyUserController = new VerifyUserController(verifyUserUseCase);
const logInUserUseCase = new LogInUser(userRepository, hasher, tokenService);
const logInUserController = new LogInUserController(logInUserUseCase);

const protectUseCase = new Protect(tokenService, userRepository);
const protectController = new ProtectController(protectUseCase);
const profileController = new ProfileController();
const forgetPasswordUseCase = new ForgetPassword(userRepository, tokenService, emailSender);
const forgetPasswordController = new ForgetPasswordController(forgetPasswordUseCase);

const createNewPasswordUseCase = new CreateNewPassword(userRepository, tokenService, hasher);
const createNewPasswordController = new CreateNewPasswordController(createNewPasswordUseCase);
const updatePasswordUseCase = new UpdatePassword(userRepository, hasher);
const updatePasswordController = new UpdatePasswordController(updatePasswordUseCase);
const resendVerificationEmailUseCase = new ResendVerificationEmail(
  userRepository,
  tokenService,
  emailSender,
);
const resendVerificationEmailController = new ResendVerificationEmailController(
  resendVerificationEmailUseCase,
);
// --- تعريف المسارات ---

// تسجيل مستخدم جديد
userRouter.post("/register", (req, res, next) => registerUserController.register(req, res, next));

// تفعيل حساب مستخدم
userRouter.get("/verify", (req, res, next) => verifyUserController.verify(req, res, next));

// تسجيل دخول مستخدم
userRouter.post("/login", (req, res, next) => logInUserController.login(req, res, next));

// صلاحيات المستخدم
userRouter.get(
  "/me",
  (req, res, next) => {
    protectController.execute(req, res, next);
  },
  (req, res, next) => profileController.getProfile(req, res, next),
);

// استعادة كلمة المرور
userRouter.post("/forget-password", (req, res, next) =>
  forgetPasswordController.forgetPassword(req, res, next),
);

// تغيير كلمة المرور
userRouter.post("/reset-password/:token", (req, res, next) =>
  createNewPasswordController.createNewPassword(req, res, next),
);

// تغيير كلمة المرور
userRouter.post("/update-password", protectController.execute, (req, res, next) =>
  updatePasswordController.updatePassword(req, res, next),
);

userRouter.post("/resend-verification-email", (req, res, next) =>
  resendVerificationEmailController.resendToken(req, res, next),
);

export { userRouter };
