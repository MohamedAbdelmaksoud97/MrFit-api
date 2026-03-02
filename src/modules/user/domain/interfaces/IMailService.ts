export interface IMailService {
  sendWelcomeEmail(email: string, username: string): Promise<void>;
  sendActivationEmail(email: string, token: string): Promise<void>;
}
