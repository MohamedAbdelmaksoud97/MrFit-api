export class AppError extends Error {
  public readonly status: string;
  public readonly isOperational: boolean;

  constructor(
    public message: string,
    public statusCode: number = 400,
  ) {
    super(message);

    this.statusCode = statusCode;
    // إذا بدأ الكود بـ 4 فهو fail، وإذا كان 5 فهو error
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // بنعلم الخطأ ده إنه "تحت السيطرة"
    this.isOperational = true;

    // دي بتخلي الـ Stack Trace يشاور على المكان الصح للخطأ
    Error.captureStackTrace(this, this.constructor);

    // توافقية مع TypeScript
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
