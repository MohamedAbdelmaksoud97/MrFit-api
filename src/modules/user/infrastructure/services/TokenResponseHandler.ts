import { Response } from "express";

export class TokenResponseHandler {
  static send(res: Response, token: string, message: string = "Success") {
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.set("Authorization", `Bearer ${token}`);

    return res.status(200).json({
      success: true,
      message,
      token,
    });
  }
}
