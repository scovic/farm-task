import { Dependency } from "dependency";
import { Router } from "express";
import { getV1ApiRouter } from "./v1"

export function getApiRouter(dependency: Dependency) {
  const router = Router();

  router.use("/v1", getV1ApiRouter(dependency));

  return router;
}
