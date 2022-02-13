import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { reIssueAccessToken } from "../service/session.service";
import { decode } from "../utils/jwt.utils";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  const refreshToken = get(req, "headers.x-refresh");

  if (!accessToken) return next();

  const decodeAccessToken = decode(accessToken);

  if (!decodeAccessToken) return next();

  const { decoded, expired } = decodeAccessToken;

  if (decoded) {
    // @ts-ignore
    req.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      //   Add the new access token to the response header
      res.setHeader("x-access-token", newAccessToken);

      const decodeNewAccessToken = decode(newAccessToken);

      if (!decodeNewAccessToken) return next();

      const { decoded } = decodeNewAccessToken;

      // @ts-ignore
      req.user = decoded;
    }

    return next();
  }

  return next();
};

export default deserializeUser;
