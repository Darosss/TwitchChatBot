import { NextFunction, Request, Response } from "express";
import { getConfigs, updateConfigs, ConfigUpdateData } from "@services";
import { configDefaults } from "@defaults";

export const getConfigsList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const configs = await getConfigs();

    return res.status(200).send({ data: configs });
  } catch (err) {
    next(err);
  }
};

export const editConfigs = async (req: Request<{}, {}, ConfigUpdateData, {}>, res: Response, next: NextFunction) => {
  const {
    commandsConfigs,
    timersConfigs,
    chatGamesConfigs,
    triggersConfigs,
    pointsConfigs,
    loyaltyConfigs,
    musicConfigs,
    headConfigs
  } = req.body;

  const updateData = {
    commandsConfigs,
    timersConfigs,
    chatGamesConfigs,
    triggersConfigs,
    pointsConfigs,
    musicConfigs,
    loyaltyConfigs,
    headConfigs
  };
  try {
    await updateConfigs(updateData);
    return res.status(200).send({ message: "Configs updated successfully" });
  } catch (err) {
    next(err);
  }
};

export const resetConfigsToDefaults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateConfigs(configDefaults);

    return res.status(200).send({ message: "Configs reset to default successfully" });
  } catch (err) {
    next(err);
  }
};
