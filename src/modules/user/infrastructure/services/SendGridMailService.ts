// src/modules/user/infrastructure/services/SendGridMailService.ts
import sgMail from "@sendgrid/mail";
import { IMailService } from "../../domain/interfaces/IMailService";
import { AppError } from "../../../../shared/domain/errors/AppError";

export class SendGridMailService implements IMailService {
  constructor() {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY is missing in .env");
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    const html = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h1>Welcome to MrFit, ${username}! 🚀</h1>
        <p>We're excited to help you reach your fitness goals.</p>
        <p>Start by generating your first AI-powered nutrition and workout plans.</p>
      </div>
    `;

    await this.send(email, "Welcome to MrFit!", html);
  }

  async sendActivationEmail(email: string, token: string): Promise<void> {
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    const html = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h1>Activate Your Account</h1>
        <p>Please click the button below to verify your email address:</p>
        <a href="${verifyUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
           Verify Email
        </a>
        <p>This link expires in 1 hour.</p>
      </div>
    `;

    await this.send(email, "Verify your email - MrFit", html);
  }

  // Private helper to centralize error handling and sending logic
  private async send(to: string, subject: string, html: string): Promise<void> {
    try {
      await sgMail.send({
        to,
        from: process.env.SENDGRID_SENDER || "noreply@mrfit.com",
        subject,
        html,
      });
      console.log(`[MailService] Email sent to ${to}`);
    } catch (error: any) {
      console.error("[MailService] SendGrid Error:", error?.response?.body || error);
      // بنرمي AppError عشان الـ Global Error Handler يلقطها
      throw new AppError("Failed to send email. Please try again later.", 500);
    }
  }
}
