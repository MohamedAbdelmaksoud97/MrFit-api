import { Request, Response, NextFunction } from "express";
import { RegisterUser } from "../application/use-cases/RegisterUser";
import { catchAsync } from "../../../shared/domain/errors/CatchAsync";

export class RegisterUserController {
  constructor(private registerUserUseCase: RegisterUser) {}

  register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // مش محتاجين try/catch هنا خالص!

    const registerUserDTO = req.body;

    const result = await this.registerUserUseCase.execute(registerUserDTO);

    return res.status(201).json({
      success: true,
      data: result,
    });
  });
}
