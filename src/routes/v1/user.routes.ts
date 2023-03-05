import { Dependency } from "dependency";
import { Router } from "express";
import { UsersController } from "modules/users/users.controller";

export function getUsersRouter(dependency: Dependency) {
  const router = Router();
  const usersController: UsersController = dependency.getController(UsersController.name) as UsersController;

  router.post("/", usersController.create);

  return router;
}
