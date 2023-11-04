import { NextFunction, Request, Response } from "express";
import { ApiClient } from "@twurple/api";
import { createNewAuth, getAuthToken, removeAuthToken } from "@services";
import { RefreshingAuthProvider, getTokenInfo } from "@twurple/auth";
import { getTwitchAuthUrl } from "../auth";
import { logger, decryptToken } from "@utils";
import { clientId, clientSecret, encryptionKey } from "@configs";
import { AuthorizedUserData } from "stream/types";
import { initializeHandlers } from "../stream";

export const twitchHandlersMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authData = await initializeAuthToken();

  if (!authData) {
    const authUrl = getTwitchAuthUrl();
    return res.redirect(authUrl.toString());
  }

  try {
    const tokeninfo = await getTokenInfo(authData.decryptedAccessToken);
    // Pretty sure it's always string so null assertion
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const authorizedUser: AuthorizedUserData = { id: tokeninfo.userId!, name: tokeninfo.userName! };
    const twitchApi = new ApiClient({ authProvider: authData.authProvider });

    if (!authorizedUser.id || !authorizedUser.name) {
      throw Error("Something went wrong, try login again");
    }

    await initializeHandlers({ twitchApi, authorizedUser, socketIO: req.io });

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

const initializeAuthToken = async () => {
  const tokenDB = await getAuthToken();
  if (!tokenDB) return;

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

  return { authProvider, decryptedAccessToken };
};
