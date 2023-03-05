import { Router } from "express";
import routesv1 from "./v1"

const routes = Router();

routes.use("/v1", routesv1);

export default routes;
