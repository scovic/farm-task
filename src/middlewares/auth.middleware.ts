import { Unauthorized } from "errors/errors";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "modules/auth/auth.service";

export function getAuthMiddleware(authService: AuthService): (req: Request, resp: Response, next: NextFunction) => void {
  return async function AuthMiddleware(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Unauthorized("Unauthorized");
    }
    
    const [bearerKeyword, token] = authHeader.split(" ");
    
    if (bearerKeyword.toLowerCase() !== "bearer") {
      throw new Unauthorized("Unauthorized");
    }

    if (!authService.isJwtTokenValid(token)) {
      throw new Unauthorized("Unauthorized");
    }

    const user = await authService.getUserFromJwtToken(token);
    req.body.user = user;
    next();    
  }
}
