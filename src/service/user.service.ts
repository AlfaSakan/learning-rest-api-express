import { DocumentDefinition } from "mongoose";
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

const findUser = () => {};
