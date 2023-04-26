import Express, { NextFunction, Request, Response } from "express";
import { getConfigs, updateConfigs, ConfigUpdateData } from "@services/configs";
import { configDefaults } from "@defaults/configsDefaults";

export const getConfigsList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const configs = await getConfigs();

    return res.status(200).send(configs);
  } catch (err) {
    next(err);
  }
};

export const editConfigs = async (
  req: Request<{}, {}, ConfigUpdateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const {
    commandsConfigs,
    timersConfigs,
    chatGamesConfigs,
    triggersConfigs,
    pointsConfigs,
    loyaltyConfigs,
    musicConfigs,
    headConfigs,
  } = req.body;

  try {
    const config = await updateConfigs({
      commandsConfigs: commandsConfigs,
      timersConfigs: timersConfigs,
      chatGamesConfigs: chatGamesConfigs,
      triggersConfigs: triggersConfigs,
      pointsConfigs: pointsConfigs,
      musicConfigs: musicConfigs,
      loyaltyConfigs: loyaltyConfigs,
      headConfigs: headConfigs,
    });
    return res.status(200).send({ message: "Updated successfully" });
  } catch (err) {
    next(err);
  }
};

export const resetConfigsToDefaults = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const configs = await updateConfigs(configDefaults);

    return res
      .status(200)
      .send({ message: "Configs reset to default successfully" });
  } catch (err) {
    next(err);
  }
};
