import { Dependency } from "dependency";
import { Router } from "express";
import { FarmsController } from "modules/farms/farms.controller";

export function getFarmsRouter(dependency: Dependency) {
  const router = Router();
  const farmsController: FarmsController = dependency.getController(FarmsController.name) as FarmsController;

  router.get("/", (req, res, next) => farmsController.getAll(req, res, next));
  router.post("/", (req, res, next) => farmsController.createFarm(req, res, next));
  router.delete("/:id", (req, res, next) => farmsController.deleteFarm(req, res, next));

  return router;
}
