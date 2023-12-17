import { getTwitchAuthUrl } from "./utils";
import { Request, Response } from "express";

export const afterTwitchAuthorization = async (req: Request, res: Response) => {
  res.status(200).send("Logged in successfully! You can close this page");
};

export const getTwitchAuthorizeUrl = (req: Request, res: Response) => {
  const authUrl = getTwitchAuthUrl();
  res.status(200).send({ data: authUrl });
};
