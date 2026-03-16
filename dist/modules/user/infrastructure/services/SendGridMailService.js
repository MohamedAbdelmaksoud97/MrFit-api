"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendGridMailService = void 0;
// src/modules/user/infrastructure/services/SendGridMailService.ts
const mail_1 = __importDefault(require("@sendgrid/mail"));
const AppError_1 = require("../../../../shared/domain/errors/AppError");
class SendGridMailService {
    brandColor = "#2563eb"; // Electric Blue
    accentColor = "#0f172a"; // Dark Slate
    constructor() {
        if (!process.env.SENDGRID_API_KEY) {
            throw new Error("SENDGRID_API_KEY is missing in .env");
        }
        mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
    }
    // Helper لإنشاء الـ Template الأساسي عشان منكررش الكود
    getHtmlTemplate(content) {
        return `
      <div style="background-color: #f8fafc; padding: 40px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <div style="background-color: ${this.accentColor}; padding: 30px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; letter-spacing: 2px; font-size: 28px;">Mr<span style="color: ${this.brandColor};">Fit</span></h2>
          </div>
          
          <div style="padding: 40px; line-height: 1.6; color: #334155;">
            ${content}
          </div>
          
          <div style="padding: 20px; text-align: center; background-color: #f1f5f9; color: #64748b; font-size: 12px;">
            <p>© ${new Date().getFullYear()} MrFit AI. All rights reserved.</p>
            <p>Push your limits. Every single day.</p>
          </div>
        </div>
      </div>
    `;
    }
    async sendWelcomeEmail(email, username) {
        const content = `
      <h1 style="color: ${this.accentColor}; font-size: 24px;">Welcome aboard, ${username}! 🚀</h1>
      <p style="font-size: 16px;">We're thrilled to have you in the <b>MrFit</b> community. You've just taken the first step toward a stronger, healthier version of yourself.</p>
      <div style="background-color: #f0f7ff; border-left: 4px solid ${this.brandColor}; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #1e40af;"><b>Next Step:</b> Log in to generate your customized AI workout and nutrition plans.</p>
      </div>
      <p>Let's crush those goals together!</p>
    `;
        await this.send(email, "Welcome to the Tribe! 🚀", this.getHtmlTemplate(content));
    }
    async sendActivationEmail(email, token) {
        const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
        const content = `
      <h1 style="color: ${this.accentColor}; font-size: 22px;">Verify Your Identity</h1>
      <p>Thank you for signing up! To get full access to your AI fitness dashboard, please confirm your email address.</p>
      <div style="text-align: center; margin: 35px 0;">
        <a href="${verifyUrl}" 
           style="background-color: ${this.brandColor}; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
           Verify Email Address
        </a>
      </div>
      <p style="font-size: 13px; color: #94a3b8; text-align: center;">This link will expire in 60 minutes for security reasons.</p>
    `;
        await this.send(email, "Verify your MrFit account", this.getHtmlTemplate(content));
    }
    async sendResetPasswordEmail(email, token) {
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
        const content = `
      <h1 style="color: ${this.accentColor}; font-size: 22px;">Reset Your Password</h1>
      <p>Forgot your password? No worries, it happens to the best of us. Click the button below to set a new one.</p>
      <div style="text-align: center; margin: 35px 0;">
        <a href="${resetUrl}" 
           style="background-color: ${this.brandColor}; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
           Set New Password
        </a>
      </div>
      <p style="font-size: 13px; color: #64748b;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
    `;
        await this.send(email, "Password Reset Request - MrFit", this.getHtmlTemplate(content));
    }
    async send(to, subject, html) {
        try {
            await mail_1.default.send({
                to,
                from: {
                    name: "MrFit AI",
                    email: process.env.SENDGRID_SENDER || "noreply@mrfit.com",
                },
                subject,
                html,
            });
            console.log(`[MailService] Luxury Email sent to ${to}`);
        }
        catch (error) {
            console.error("[MailService] SendGrid Error:", error?.response?.body || error);
            throw new AppError_1.AppError("Failed to deliver email. Systems are being checked.", 500);
        }
    }
}
exports.SendGridMailService = SendGridMailService;
