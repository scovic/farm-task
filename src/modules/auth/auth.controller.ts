import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = await this.authService.login(req.body as LoginUserDto);
      return res.status(201).send({ token });
    } catch (error) {
      next(error);
    }
  }
}
