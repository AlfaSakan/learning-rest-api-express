import { NextFunction, Request, Response } from "express";
import { ValidationError } from "yup";
import { AnySchema } from "yup";
import log from "../logger";

const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      log.error(error);
      if (error instanceof ValidationError) {
        return res.status(400).send(error.errors);
      }
    }
  };

export default validate;
