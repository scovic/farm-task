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

    const accessToken = await authService.getAccessToken(token);

    if (!accessToken) {
      resp.status(401).send("Unauthorized");
      return;
    }

    if (!authService.isJwtTokenValid(accessToken.token)) {
      console.log("!authService.isJwtTokenValid(accessToken.token)")
      resp.status(401).send("Unauthorized");
      return;
    }

    req.body.user = accessToken.user;
    next();    
  }
}
