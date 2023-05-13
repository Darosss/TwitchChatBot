import { NextFunction, Request, Response } from "express";
import { ApiClient } from "@twurple/api";
import { createNewAuth, getAuthToken } from "@services/auth";
import { getConfigs } from "@services/configs";
import { RefreshingAuthProvider } from "@twurple/auth";
import ClientTmiHandler from "../stream/TwitchTmiHandler";
import StreamHandler from "../stream/StreamHandler";
import { getTwitchAuthUrl } from "../auth/auth";
import { logger } from "@utils/loggerUtil";
import { botPassword, botUsername, clientId, clientSecret, encryptionKey } from "@configs/envVariables";
import { decryptToken } from "@utils/tokenUtil";

const authorizationTwitch = async (req: Request, res: Response, next: NextFunction) => {
  const tokenDB = await getAuthToken();
  if (!tokenDB) {
    const authUrl = getTwitchAuthUrl();
    return res.redirect(authUrl.toString());
  }
  const decryptedAccessToken = decryptToken(tokenDB.accessToken, tokenDB.ivAccessToken, encryptionKey);
  const decryptedRefreshToken = decryptToken(tokenDB.refreshToken, tokenDB.ivRefreshToken, encryptionKey);

  const authProvider = new RefreshingAuthProvider(
    {
      clientId,
      clientSecret,
      onRefresh: async (newTokenData) => {
        await createNewAuth(newTokenData);
      }
    },
    {
      ...tokenDB,
      accessToken: decryptedAccessToken,
      refreshToken: decryptedRefreshToken
    }
  );

  try {
    const twitchApi = new ApiClient({ authProvider });
    const authorizedUser = await twitchApi.users.getMe();
    const configDB = await getConfigs();

    if (!authorizedUser || !configDB) {
      throw Error("Something went wrong, try login again");
    }

    const clientTmi = await ClientTmiHandler.getInstance({
      userToListen: authorizedUser.name,
      username: botUsername,
      password: botPassword
    });

    StreamHandler.getInstance({
      twitchApi: twitchApi,
      config: configDB,
      authorizedUser: authorizedUser,
      socketIO: req.io,
      clientTmi: clientTmi
    });

    req.io.emit("forceReconnect");

    return next();
  } catch (err) {
    // await removeAuthToken();
    if (err instanceof Error) {
      res.status(400).send({ message: "Something went wrong. Please log in again" });
      logger.error(`Error occured while using ApiClient ${err}`);
    } else {
      res.status(500).send({ message: "Interfnal server error" });
      logger.error(`An unknown error occured while using ApiClient ${err}`);
    }
  }
};

export default authorizationTwitch;
