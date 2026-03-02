export interface ITokenService {
  generateToken(payload: string): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload | null>;
}

export interface TokenPayload {
  sub: string; // الـ User ID مباشرة كـ string
  type: string; // 'access' أو 'activation'
  iat?: number;
  exp?: number;
}
