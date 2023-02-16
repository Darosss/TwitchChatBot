import { getConfigs, updateConfigs } from "@services/Configs";
import Express, { Request, Response } from "express";

const getConfigsList = async (req: Request, res: Response) => {
  try {
    const configs = await getConfigs();

    if (!configs) {
      return res.status(400).send({ message: "Couldn't get configs" });
    }
    return res.status(200).send(configs);
  } catch (error) {
    console.error(error);

    return res.status(500).send({ message: "Internal server error" });
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
    const config = await updateConfigs({
      commandsPrefix: commandsPrefix,
      timersIntervalDelay: timersIntervalDelay,
      activeUserTimeDelay: activeUserTimeDelay,
      chatGamesIntervalDelay: chatGamesIntervalDelay,
      minActiveUsersThreshold: minActiveUsersThreshold,
      permissionLevels: permissionLevels,
    });

    return res.status(200).send({ message: "Updated successfully" });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ message: "Internal server error" });
  }
};

export { getConfigsList, editConfigs };
