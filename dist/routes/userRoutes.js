"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const RegisterUserController_1 = require("../modules/user/controllers/RegisterUserController");
const RegisterUser_1 = require("../modules/user/application/use-cases/RegisterUser");
const IMongooseRepository_1 = require("../modules/user/infrastructure/repositories/IMongooseRepository");
const BcryptHasher_1 = require("../modules/user/infrastructure/hashers/BcryptHasher");
const JWTService_1 = require("../modules/user/infrastructure/services/JWTService");
const VerifyUserController_1 = require("../modules/user/controllers/VerifyUserController");
const VerifyUser_1 = require("../modules/user/application/use-cases/VerifyUser");
const LogInUserController_1 = require("../modules/user/controllers/LogInUserController");
const LogInUser_1 = require("../modules/user/application/use-cases/LogInUser");
const ProtectController_1 = require("../modules/user/controllers/ProtectController");
const Protect_1 = require("../modules/user/application/use-cases/Protect");
const CreateNewPassword_1 = require("../modules/user/application/use-cases/CreateNewPassword");
const CreateNewPasswordController_1 = require("../modules/user/controllers/CreateNewPasswordController");
const ForgetPasswordController_1 = require("../modules/user/controllers/ForgetPasswordController");
const ForgetPassword_1 = require("../modules/user/application/use-cases/ForgetPassword");
const UpdatePassword_1 = require("../modules/user/application/use-cases/UpdatePassword");
const UpdatePasswordController_1 = require("../modules/user/controllers/UpdatePasswordController");
const ResendVerificationEmailController_1 = require("../modules/user/controllers/ResendVerificationEmailController");
const ResendVerificationEmail_1 = require("../modules/user/application/use-cases/ResendVerificationEmail");
const ProfileController_1 = require("../modules/user/controllers/ProfileController");
const SendGridMailService_1 = require("../modules/user/infrastructure/services/SendGridMailService");
const UpdateProfileController_1 = require("../modules/user/controllers/UpdateProfileController");
const UpdateProfile_1 = require("../modules/user/application/use-cases/UpdateProfile");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
// --- مرحلة تجميع الطبقات (The Assembly) ---
// 1. الأدوات التقنية (Infrastructure)
//const userRepository = new MongooseUserRepository();
const userRepository = new IMongooseRepository_1.MongoUserRepository();
const hasher = new BcryptHasher_1.BcryptHasher();
const tokenService = new JWTService_1.JwtTokenEmailVerificationService();
const emailSender = new SendGridMailService_1.SendGridMailService();
// 2. البزنس لوجيك (Application) - بنحقن فيه الأدوات
const registerUserUseCase = new RegisterUser_1.RegisterUser(userRepository, hasher, tokenService, emailSender);
// 3. موظف الاستقبال (Presentation) - بنحقن فيه الـ Use Case
const registerUserController = new RegisterUserController_1.RegisterUserController(registerUserUseCase);
const verifyUserUseCase = new VerifyUser_1.VerifyUser(userRepository, tokenService);
const verifyUserController = new VerifyUserController_1.VerifyUserController(verifyUserUseCase);
const logInUserUseCase = new LogInUser_1.LogInUser(userRepository, hasher, tokenService);
const logInUserController = new LogInUserController_1.LogInUserController(logInUserUseCase);
const protectUseCase = new Protect_1.Protect(tokenService, userRepository);
const protectController = new ProtectController_1.ProtectController(protectUseCase);
const profileController = new ProfileController_1.ProfileController();
const forgetPasswordUseCase = new ForgetPassword_1.ForgetPassword(userRepository, tokenService, emailSender);
const forgetPasswordController = new ForgetPasswordController_1.ForgetPasswordController(forgetPasswordUseCase);
const createNewPasswordUseCase = new CreateNewPassword_1.CreateNewPassword(userRepository, tokenService, hasher);
const createNewPasswordController = new CreateNewPasswordController_1.CreateNewPasswordController(createNewPasswordUseCase);
const updatePasswordUseCase = new UpdatePassword_1.UpdatePassword(userRepository, hasher);
const updatePasswordController = new UpdatePasswordController_1.UpdatePasswordController(updatePasswordUseCase);
const resendVerificationEmailUseCase = new ResendVerificationEmail_1.ResendVerificationEmail(userRepository, tokenService, emailSender);
const resendVerificationEmailController = new ResendVerificationEmailController_1.ResendVerificationEmailController(resendVerificationEmailUseCase);
const updateProfileUseCase = new UpdateProfile_1.UpdateProfile(userRepository);
const updateProfile = new UpdateProfileController_1.UpdateProfileController(updateProfileUseCase);
// --- مرحلة تجميع الطبقات (The Assembly) ---
// --- تعريف المسارات ---
// تسجيل مستخدم جديد
userRouter.post("/register", (req, res, next) => registerUserController.register(req, res, next));
// تفعيل حساب مستخدم
userRouter.get("/verify", (req, res, next) => verifyUserController.verify(req, res, next));
// تسجيل دخول مستخدم
userRouter.post("/login", (req, res, next) => logInUserController.login(req, res, next));
// صلاحيات المستخدم
userRouter.get("/me", (req, res, next) => {
    protectController.execute(req, res, next);
}, (req, res, next) => profileController.getProfile(req, res, next));
userRouter.post("/forget-password", (req, res, next) => forgetPasswordController.forgetPassword(req, res, next));
// تغيير كلمة المرور
userRouter.post("/reset-password/:token", (req, res, next) => createNewPasswordController.createNewPassword(req, res, next));
// تغيير كلمة المرور
userRouter.post("/update-password", protectController.execute, (req, res, next) => updatePasswordController.updatePassword(req, res, next));
userRouter.post("/resend-verification-email", (req, res, next) => resendVerificationEmailController.resendToken(req, res, next));
userRouter.patch("/update-profile", (req, res, next) => protectController.execute(req, res, next), (req, res, next) => updateProfile.excute(req, res, next));
