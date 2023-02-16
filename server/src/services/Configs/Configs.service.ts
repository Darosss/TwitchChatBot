import { Config } from "@models/config.model";
import { UpdateQuery } from "mongoose";

export const getConfigs = async () => {
  const configs = await Config.findOne({}).select({ __v: 0 });

  return configs;
};

export const updateConfigs = async (
  updateData: UpdateQuery<ConfigUpdateData>
) => {
  try {
    const config = await Config.findOneAndUpdate({}, updateData, { new: true });
    return config;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update configs");
  }
};
