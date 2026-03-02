import jwt from "jsonwebtoken";
import { ITokenService, TokenPayload } from "../../domain/interfaces/ITokenService";
export class JwtTokenEmailVerificationService implements ITokenService {
  private readonly secret = process.env.JWT_SECRET || "fallback_secret";
  private readonly expiresIn = process.env.JWT_EXPIRES_IN || "24h";

  async generateToken(userId: string): Promise<string> {
    return jwt.sign(
      { sub: userId, type: "activation" }, // أضفنا النوع هنا
      this.secret,
      { expiresIn: this.expiresIn as any },
    );
  }
  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      return jwt.verify(token, this.secret) as TokenPayload;
    } catch {
      return null;
    }
  }
}
export class JWTAccessTokenService implements ITokenService {
  private readonly secret = process.env.JWT_SECRET || "fallback_secret";
  private readonly expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";

  async generateToken(userId: string): Promise<string> {
    return jwt.sign({ sub: userId, type: "access" }, this.secret, {
      expiresIn: this.expiresIn as any,
    });
  }
  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      return jwt.verify(token, this.secret) as TokenPayload;
    } catch {
      return null;
    }
  }
}
