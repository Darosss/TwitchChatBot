import Express, { NextFunction, Request, Response } from "express";
import { getConfigs, updateConfigs } from "@services/configs";
import { ConfigUpdateData } from "@services/configs/types";

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
    headConfigs,
  } = req.body;

  try {
    const config = await updateConfigs({
      commandsConfigs: commandsConfigs,
      timersConfigs: timersConfigs,
      chatGamesConfigs: chatGamesConfigs,
      triggersConfigs: triggersConfigs,
      pointsConfigs: pointsConfigs,
      loyaltyConfigs: loyaltyConfigs,
      headConfigs: headConfigs,
    });
    return res.status(200).send({ message: "Updated successfully" });
  } catch (err) {
    next(err);
  }
};
