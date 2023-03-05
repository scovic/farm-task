import { EntityNotFoundError, OperationNotPermitted, UnprocessableEntityError } from "errors/errors";
import { NextFunction, Request, Response } from "express";

export function handleErrorMiddleware(error: Error, _: Request, res: Response, next: NextFunction): void {
  const { message } = error;

  if (error instanceof UnprocessableEntityError) {
    res.status(422).send({ name: "UnprocessableEntityError", message });
  } else if (error instanceof EntityNotFoundError) {
    res.status(404).send({ name: "EntityNotFoundError", message });
  } else if (error instanceof OperationNotPermitted) {
    res.status(403).send({ name: "OperationNotPermitted", message });
  } else {
    res.status(500).send({ message: "Internal Server Error" });
  }

  next();
}
