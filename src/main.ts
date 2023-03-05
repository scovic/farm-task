import config from "config/config";
import { Dependency } from "dependency";
import { Response } from "express";
import http from "http";
import dataSource from "orm/orm.config";
import { setupServer } from "./server/server";

async function bootstrap(): Promise<http.Server> {
  await dataSource.initialize();
  const dependency: Dependency = Dependency.setupDependency(dataSource);
  const app = setupServer(dependency);

  const port = config.APP_PORT;

  app.get("/", (_, res: Response) => {
    res.send(`Listening on port: ${port}`);
  });

  const server = http.createServer(app);
  server.listen(port);

  return server;
}

bootstrap();
