import mongoose from "mongoose";
import config from "config";
import log from "../logger";

const connect = async () => {
  try {
    const dbUri = config.get("dbUri") as string;

    await mongoose.connect(dbUri);

    log.info("Database connected");
  } catch (error) {
    log.error("db error", error);
    process.exit(1);
  }
};

export default connect;
