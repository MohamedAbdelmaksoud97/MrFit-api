import { Response } from "express";

export class TokenResponseHandler {
  static send(res: Response, token: string, message: string = "Success") {
    // 1. إرسال الكوكيز
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // ساعة
    });

    // 2. إرسال الهيدر
    res.set("Authorization", `Bearer ${token}`);

    // 3. إرسال الرد النهائي
    return res.status(200).json({
      success: true,
      message,
      token,
    });
  }
}
