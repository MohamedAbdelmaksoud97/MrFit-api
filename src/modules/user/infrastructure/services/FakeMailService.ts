import { IMailService } from "../../domain/interfaces/IMailService";

export class FakeMailService implements IMailService {
  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    console.log(`📫 [FakeMail]: Welcome email to ${username} (${email})`);
  }

  async sendActivationEmail(email: string, link: string): Promise<void> {
    console.log("-----------------------------------------");
    console.log(`📧 [FakeMail]:: Sending Activation to ${email}`);
    console.log(`🔗 [Link]: ${link}`);
    console.log("-----------------------------------------");
  }
  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    console.log(`Fake email sent to ${email} with token ${token}`);
  }
}
