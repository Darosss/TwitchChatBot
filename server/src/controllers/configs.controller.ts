import { Config } from "@models/config.model";
import Express, { Request, Response } from "express";

const getConfigsList = async (req: Request, res: Response) => {
  const { page = 1, limit = 25 } = req.query as unknown as {
    page: number;
    limit: number;
  };
  try {
    const configs = await Config.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select({ __v: 0 })
      .exec();

    res.status(200).send(configs[0]);
  } catch (error) {
    console.log(error);

    res.status(400).send({ message: "Couldn't get configs" });
  }
};

const editConfigs = async (req: Request, res: Response) => {
  const {
    commandsPrefix,
    timersIntervalDelay,
    activeUserTimeDelay,
    chatGamesIntervalDelay,
    minActiveUsersThreshold,
    permissionLevels,
  } = req.body;

  try {
    const config = await Config.findOneAndReplace(
      {},
      {
        commandsPrefix: commandsPrefix,
        timersIntervalDelay: timersIntervalDelay,
        activeUserTimeDelay: activeUserTimeDelay,
        chatGamesIntervalDelay: chatGamesIntervalDelay,
        minActiveUsersThreshold: minActiveUsersThreshold,
        permissionLevels: permissionLevels,
      }
    );
    res.status(200).send({ message: "Updated successfully" });
  } catch (error) {
    res.status(400).send({ message: "Couldn't update configs" });
  }
};

export { getConfigsList, editConfigs };
