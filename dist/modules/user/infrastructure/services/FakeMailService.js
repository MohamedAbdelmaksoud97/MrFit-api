"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeMailService = void 0;
class FakeMailService {
    async sendWelcomeEmail(email, username) {
        console.log(`📫 [FakeMail]: Welcome email to ${username} (${email})`);
    }
    async sendActivationEmail(email, link) {
        console.log("-----------------------------------------");
        console.log(`📧 [FakeMail]: Sending Activation to ${email}`);
        console.log(`🔗 [Link]: ${link}`);
        console.log("-----------------------------------------");
    }
    async sendResetPasswordEmail(email, token) {
        console.log(`Fake email sent to ${email} with token ${token}`);
    }
}
exports.FakeMailService = FakeMailService;
