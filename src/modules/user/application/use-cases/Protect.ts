import { ITokenService } from "../../domain/interfaces/ITokenService";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { AppError } from "../../../../shared/domain/errors/AppError";

export class Protect {
  constructor(
    private tokenService: ITokenService,
    private userRepository: IUserRepository,
  ) {}

  async validateAndGetUser(token: string) {
    // 1. التحقق من صحة التوكن
    const payload = await this.tokenService.verifyToken(token);

    // لو التوكن منتهي أو ملعوب فيه، بنرمي 401 (Unauthorized)
    if (!payload || !payload.sub) {
      throw new AppError("Invalid or expired token. Please log in again.", 401);
    }

    // 2. التأكد إن صاحب التوكن لسه موجود في الداتابيز
    const user = await this.userRepository.findById(payload.sub);

    console.log(user);

    if (!user) {
      throw new AppError("The user belonging to this token no longer exists.", 401);
    }

    // 3. (إضافي) ممكن نتأكد هنا لو اليوزر غير الباسورد بعد صدور التوكن ده (Security Bonus)

    return user;
  }
}
