import mongoose, { ConnectOptions } from "mongoose";

const initMongoDataBase = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(
    process.env.DB_CONN_STRING as string,
    { useNewUrlParser: true } as ConnectOptions
  );
};

export default initMongoDataBase;
