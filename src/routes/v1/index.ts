import { Dependency } from "dependency";
import { Router } from "express";
import { getAuthMiddleware } from "middlewares/auth.middleware";
import { AuthService } from "modules/auth/auth.service";
import { getAuthRouter } from "./auth.routes";
import { getFarmsRouter } from "./farm.routes";
import { getUsersRouter } from "./user.routes";

export function getV1ApiRouter(dependency: Dependency) {
  const router = Router();
  const authService: AuthService = dependency.getService(AuthService.name) as AuthService;

  router.use("/auth", getAuthRouter(dependency));
  router.use("/users", getAuthMiddleware(authService),  getUsersRouter(dependency));
  router.use("/farms", getAuthMiddleware(authService), getFarmsRouter(dependency));

  return router;
}
