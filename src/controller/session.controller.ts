import { Request, Response } from "express";
import config from "config";
import { get } from "lodash";

import log from "../logger";
import { sign } from "../utils/jwt.utils";
import {
  createSession,
  createAccessToken,
  updateSession,
  findSessions,
} from "../service/session.service";
import { validatePassword } from "../service/user.service";

export const createUserSessionHandler = async (req: Request, res: Response) => {
  try {
    // validate email and password
    const user = await validatePassword(req.body);
    if (!user) {
      return res.sendStatus(401).send("Invalid username or password");
    }

    // Create a session
    const session = await createSession(user._id, req.get("user-agent") || "");

    if (!session) {
      return res.sendStatus(401).send("Failed create session");
    }

    // Create access token
    const accessToken = await createAccessToken({ user, session });

    // Create refresh token
    const refreshToken = sign(session, {
      expiresIn: config.get("refreshTokenTtl"),
    });

    // send refresh & access token back
    res.send({ accessToken, refreshToken });
  } catch (error) {
    res.sendStatus(401);
    log.error(error);
  }
};

export const invalidateUserSessionHandler = async (
  req: Request,
  res: Response
) => {
  const sessionId = get(req, "user.session");
  await updateSession({ _id: sessionId }, { valid: false });

  return res.sendStatus(200);
};

export const getUserSessionHandler = async (req: Request, res: Response) => {
  const userId = get(req, "user._id");

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
};
