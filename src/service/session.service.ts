import { FilterQuery, LeanDocument, UpdateQuery } from "mongoose";
import config from "config";

import Session, { SessionDocument } from "../model/session.model";
import { UserDocument } from "../model/user.model";
import log from "../logger";
import { decode, sign } from "../utils/jwt.utils";
import { get } from "lodash";
import { findUser } from "./user.service";

export const createSession = async (userId: string, userAgent: string) => {
  try {
    const session = await Session.create({ user: userId, userAgent });
    return session.toJSON();
  } catch (error) {
    log.error(error);
    return false;
  }
};

export const createAccessToken = async ({
  user,
  session,
}: {
  user:
    | Omit<UserDocument, "password">
    | LeanDocument<Omit<UserDocument, "password">>;
  session: SessionDocument | LeanDocument<SessionDocument>;
}) => {
  // build and return the new access token
  const accessTokenTtl = config.get("accessTokenTtl") as string;

  const userObject = ({ ...user } as UserDocument).toJSON();

  const accessToken = sign(
    { ...userObject, session: session._id },
    { expiresIn: accessTokenTtl }
  );
  return accessToken;
};

export const reIssueAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  // Decode the refresh token
  const decodeRefreshToken = decode(refreshToken);

  if (!decodeRefreshToken) return false;

  const { decoded } = decodeRefreshToken;

  if (!decoded && !get(decoded, "_id")) return false;

  // Get the session
  const session = await Session.findById(get(decoded, "_id"));

  // Make sure the session is still valid
  if (!session || !session?.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = createAccessToken({ user, session });

  return accessToken;
};

export const updateSession = async (
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) => {
  return Session.updateOne(query, update);
};

export const findSessions = async (query: FilterQuery<SessionDocument>) => {
  return Session.find(query).lean();
};
