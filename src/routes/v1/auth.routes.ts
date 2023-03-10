import { Dependency } from "dependency";
import { Router } from "express";
import { AuthController } from "modules/auth/auth.controller";

export function getAuthRouter(dependency: Dependency) {
  const router = Router();
  const authController: AuthController = dependency.getController(AuthController.name) as AuthController;
  
  router.post("/login", (req, res, next) => authController.login(req, res, next));

  return router;
}
