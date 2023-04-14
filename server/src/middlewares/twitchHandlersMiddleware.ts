import { NextFunction, Request, Response } from "express";
import { ApiClient } from "@twurple/api";
import { createNewAuth, getAuthToken, removeAuthToken } from "@services/auth";
import { getConfigs } from "@services/configs";
import { RefreshingAuthProvider } from "@twurple/auth";
import ClientTmiHandler from "../stream/TwitchTmiHandler";
import StreamHandler from "../stream/StreamHandler";
import { getTwitchAuthUrl } from "../auth/auth";
import { logger } from "@utils/loggerUtil";

const authorizationTwitch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(";hgehehehe");
  const clientId = process.env.CLIENT_ID!;
  const clientSecret = process.env.CLIENT_SECRET!;

  const tokenDB = await getAuthToken();
  if (!tokenDB) {
    const authUrl = getTwitchAuthUrl();
    return res.redirect(authUrl.toString());
  }
  const authProvider = new RefreshingAuthProvider(
    {
      clientId,
      clientSecret,
      onRefresh: async (newTokenData) => {
        await createNewAuth(newTokenData);
      },
    },
    tokenDB
  );

  try {
    const twitchApi = new ApiClient({ authProvider });
    const authorizedUser = await twitchApi.users.getMe();
    const configDB = await getConfigs();

    if (!authorizedUser || !configDB) {
      throw Error("Something went wrong, try login again");
    }

    const clientTmi = ClientTmiHandler.getInstance({
      userToListen: authorizedUser.name,
      username: process.env.bot_username!,
      password: process.env.bot_password!,
    });

    const streamHandler = StreamHandler.getInstance({
      twitchApi: twitchApi,
      config: configDB,
      authorizedUser: authorizedUser,
      socketIO: req.io,
      clientTmi: clientTmi,
    });
    return next();
  } catch (err) {
    await removeAuthToken();
    if (err instanceof Error) {
      res
        .status(400)
        .send({ message: "Something went wrong. Please log in again" });
      logger.error(`Error occured while using ApiClient ${err}`);
    } else {
      res.status(500).send({ message: "Interfnal server error" });
      logger.error(`An unknown error occured while using ApiClient ${err}`);
    }
  }
};

export default authorizationTwitch;
