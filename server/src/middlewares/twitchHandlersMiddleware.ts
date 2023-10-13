import { NextFunction, Request, Response } from "express";
import { ApiClient } from "@twurple/api";
import { createNewAuth, getAuthToken, removeAuthToken, getConfigs } from "@services";
import { RefreshingAuthProvider, getTokenInfo } from "@twurple/auth";
import ClientTmiHandler from "../stream/TwitchTmiHandler";
import StreamHandler from "../stream/StreamHandler";
import { getTwitchAuthUrl } from "../auth";
import { logger, decryptToken } from "@utils";
import { botPassword, botUsername, clientId, clientSecret, encryptionKey } from "@configs";

export const twitchHandlersMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const tokenDB = await getAuthToken();
  if (!tokenDB) {
    const authUrl = getTwitchAuthUrl();
    return res.redirect(authUrl.toString());
  }
  const decryptedAccessToken = decryptToken(tokenDB.accessToken, tokenDB.ivAccessToken, encryptionKey);
  const decryptedRefreshToken = decryptToken(tokenDB.refreshToken, tokenDB.ivRefreshToken, encryptionKey);

  const authProvider = new RefreshingAuthProvider({
    clientId,
    clientSecret
  });

  authProvider.onRefresh(async (userId, newTokenData) => {
    const { accessToken, refreshToken, expiresIn, obtainmentTimestamp, scope } = newTokenData;
    await createNewAuth({
      accessToken: accessToken,
      refreshToken: refreshToken || "",
      expiresIn: expiresIn || 0,
      obtainmentTimestamp: obtainmentTimestamp,
      scope: scope,
      userId: userId
    });
  });

  authProvider.addUserForToken({
    accessToken: decryptedAccessToken,
    refreshToken: decryptedRefreshToken,
    expiresIn: tokenDB.expiresIn,
    obtainmentTimestamp: tokenDB.obtainmentTimestamp
  });

  try {
    const tokeninfo = await getTokenInfo(decryptedAccessToken);
    // Pretty sure it's always string so null assertion
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const authorizedUser = { id: tokeninfo.userId!, name: tokeninfo.userName! };
    const twitchApi = new ApiClient({ authProvider });

    const configDB = await getConfigs();

    if (!authorizedUser.id || !authorizedUser.name || !configDB) {
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
      authorizedUser: { id: authorizedUser.id, name: authorizedUser.name },
      socketIO: req.io,
      clientTmi: clientTmi
    });

    req.io.emit("forceReconnect");

    return next();
  } catch (err) {
    await removeAuthToken();
    if (err instanceof Error) {
      res.status(400).send({ message: "Something went wrong. Please log in again" });
      logger.error(`Error occured while using ApiClient ${err}`);
    } else {
      res.status(500).send({ message: "Interfnal server error" });
      logger.error(`An unknown error occured while using ApiClient ${err}`);
    }
  }
};
