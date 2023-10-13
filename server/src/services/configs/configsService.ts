import { Config } from "@models/configModel";
import { AppError, handleAppError, logger, checkExistResource } from "@utils";
import { UpdateQuery } from "mongoose";
import { ConfigUpdateData } from "./types";

export const getConfigs = async () => {
  try {
    const configs = await Config.findOne({}).select({ __v: 0 });
    if (!configs) {
      await createNewConfig();
      logger.error(`Could not get configs: No configs found. Create default one`);

      throw new AppError(400, "Couldn't get configs. Default configs should be accessible after refresh.");
    }

    return configs;
  } catch (err) {
    logger.error(`Error occured while getting configs. ${err}`);
    handleAppError(err);
  }
};

export const configExist = async () => {
  return await Config.exists({});
};

export const createNewConfig = async () => {
  try {
    return await Config.create({});
  } catch (err) {
    logger.error(`Error occured while creating new configs. ${err}`);
    handleAppError(err);
  }
};

export const updateConfigs = async (updateData: UpdateQuery<ConfigUpdateData>) => {
  try {
    const foundConfig = await Config.findOneAndUpdate({}, updateData, {
      new: true
    });

    const updatedConfigs = checkExistResource(foundConfig, "Configs");

    return updatedConfigs;
  } catch (err) {
    logger.error(`Error occured while updating configs. ${err}`);
    handleAppError(err);
  }
};
