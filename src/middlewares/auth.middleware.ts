import { NextFunction, Request, Response } from "express";
import { AuthService } from "modules/auth/auth.service";

export function getAuthMiddleware(authService: AuthService): (req: Request, resp: Response, next: NextFunction) => void {
  return async function AuthMiddleware(req: Request, resp: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      resp.status(401).send("Unauthorized");
      return;
    }
    
    const [bearerKeyword, token] = authHeader.split(" ");
    
    if (bearerKeyword.toLowerCase() !== "bearer") {
      resp.status(401).send("Unauthorized");
      return;
    }

    if (!authService.isJwtTokenValid(token)) {
      resp.status(401).send("Unauthorized");
      return;
    }

    const user = await authService.getUserFromJwtToken(token);
    req.body.user = user;
    next();    
  }
}
