import { Dependency } from "dependency";
import express, { Express } from "express";
import { handleErrorMiddleware } from "middlewares/error-handler.middleware";
import morgan from "morgan";
import { getApiRouter } from "routes";

export function setupServer(dependency: Dependency): Express {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.use("/api", getApiRouter(dependency));
  app.use(handleErrorMiddleware);

  return app;
}
