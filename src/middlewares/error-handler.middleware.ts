import { EntityAlreadyExistsError, EntityNotFoundError, OperationNotPermittedError, UnprocessableEntityError } from "errors/errors";
import { NextFunction, Request, Response } from "express";

export function handleErrorMiddleware(error: Error, _: Request, res: Response, next: NextFunction): void {
  const { message } = error;

  if (error instanceof UnprocessableEntityError) {
    res.status(422).send({ name: "UnprocessableEntityError", message });
  } else if (error instanceof EntityNotFoundError) {
    res.status(404).send({ name: "EntityNotFoundError", message });
  } else if (error instanceof OperationNotPermittedError) {
    res.status(403).send({ name: "OperationNotPermittedError", message });
  } else if (error instanceof EntityAlreadyExistsError) {
    res.status(409).send({ name: "EntityAlreadyExistsError", message });
  } else {
    res.status(500).send({ message: "Internal Server Error" });
  }

  next();
}
