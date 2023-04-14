import { getTwitchAuthUrl } from "../auth/auth";
import Express, { Request, Response } from "express";

export const afterTwitchAuthorization = async (req: Request, res: Response) => {
  req.io.emit("forceReconnect");
  res.status(200).send("Logged in successfully! You can close this page");
};

export const getTwitchAuthorizeUrl = (req: Request, res: Response) => {
  const authUrl = getTwitchAuthUrl();
  res.status(200).send({ data: authUrl });
};
