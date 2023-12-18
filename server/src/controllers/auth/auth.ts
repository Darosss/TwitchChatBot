import { getTwitchAuthUrl } from "./utils";
import { Request, Response } from "express";
import { getDiscordInviteUrl as getDiscordInviteUrlUtil } from "./utils";
import { discordClientId } from "@configs";

export const afterTwitchAuthorization = async (req: Request, res: Response) => {
  res.status(200).send("Logged in successfully! You can close this page");
};

export const getTwitchAuthorizeUrl = (req: Request, res: Response) => {
  const authUrl = getTwitchAuthUrl();
  res.status(200).send({ data: authUrl });
};

export const getDiscordInviteUrl = (req: Request, res: Response) => {
  const discordInviteUrl = getDiscordInviteUrlUtil();
  res.status(200).send({
    data: discordInviteUrl,
    message: `In order to create other invite you need to visit discord site and generate your own invitation link here(https://discord.com/developers/applications/${discordClientId}/oauth2/url-generator) `
  });
};
