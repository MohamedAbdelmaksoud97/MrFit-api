import { User } from "../entities/User";

export interface IUserRepository {
  // حفظ مستخدم جديد أو تحديث مستخدم موجود
  save(user: User): Promise<void>;

  // البحث عن مستخدم بالإيميل (مهم جداً للـ Login والـ Registration)
  findByEmail(email: string): Promise<User | null>;

  // البحث عن مستخدم بالـ ID (مهم للـ Profile والـ Authorization)
  findById(id: string): Promise<User | null>;

  // التحقق من وجود مستخدم قبل التسجيل
  exists(email: string): Promise<boolean>;

  // حذف مستخدم (لو احتاجت)
  delete(id: string): Promise<void>;
}
