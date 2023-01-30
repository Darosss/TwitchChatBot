import { Config } from "./models/config.model";
import mongoose, { ConnectOptions } from "mongoose";

const initMongoDataBase = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(
    process.env.DB_CONN_STRING as string,
    { useNewUrlParser: true } as ConnectOptions
  );
};

export const initDefaultsDB = async () => {
  if ((await Config.countDocuments()) < 1) await new Config().save();
};

export default initMongoDataBase;
