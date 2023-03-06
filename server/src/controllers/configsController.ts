import Express, { NextFunction, Request, Response } from "express";
import { getConfigs, updateConfigs } from "@services/configs";

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    commandsPrefix,
    timersIntervalDelay,
    activeUserTimeDelay,
    chatGamesIntervalDelay,
    minActiveUsersThreshold,
    permissionLevels,
    pointsIncrement,
    randomMessageChance,
    intervalCheckViewersPeek,
  } = req.body;

  try {
    const config = await updateConfigs({
      commandsPrefix: commandsPrefix,
      timersIntervalDelay: timersIntervalDelay,
      activeUserTimeDelay: activeUserTimeDelay,
      chatGamesIntervalDelay: chatGamesIntervalDelay,
      minActiveUsersThreshold: minActiveUsersThreshold,
      permissionLevels: permissionLevels,
      pointsIncrement: pointsIncrement,
      randomMessageChance: randomMessageChance,
      intervalCheckViewersPeek: intervalCheckViewersPeek,
    });

    return res.status(200).send({ message: "Updated successfully" });
  } catch (err) {
    next(err);
  }
};
