import bcrypt from "bcrypt";
import { IHasher } from "../../domain/interfaces/IHasher";

export class BcryptHasher implements IHasher {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  // ميثود إضافية هنحتاجها في الـ Login مستقبلاً
  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
