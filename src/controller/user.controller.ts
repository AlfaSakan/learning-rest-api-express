import { Request, Response } from "express";
import { omit } from "lodash";
import { Error } from "mongoose";
import log from "../logger";
import { createUser } from "../service/user.service";

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);

    return res.send(omit(user.toJSON(), "password"));
  } catch (error) {
    log.error(error);
    if (error instanceof Error) {
      return res.status(409).send(error.message);
    }
  }
};
