import { Dependency } from "dependency";
import { Router } from "express";
import { FarmsController } from "modules/farms/farms.controller";

export function getFarmsRouter(dependency: Dependency) {
  const router = Router();
  const farmsController: FarmsController = dependency.getController(FarmsController.name) as FarmsController;

  router.get("/", farmsController.getAll);
  router.post("/", farmsController.createFarm);
  router.delete("/:id", farmsController.deleteFarm);

  return router;
}
