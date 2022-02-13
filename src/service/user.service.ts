import { omit } from "lodash";
import { DocumentDefinition, FilterQuery, UpdateQuery } from "mongoose";
import log from "../logger";
import User, { UserDocument } from "../model/user.model";

export const createUser = async (input: DocumentDefinition<UserDocument>) => {
  try {
    return await User.create(input);
  } catch (error) {
    log.error(error);
    throw error;
  }
};

export const findUser = async (query: FilterQuery<UserDocument>) => {
  return User.findOne(query).lean();
};

export const validatePassword = async ({
  email,
  password,
}: {
  email: UserDocument["email"];
  password: string;
}) => {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparedPassword(password);

  if (!isValid) {
    return false;
  }

  return omit(user, ["password"]);
  // return user.toJSON()
};
