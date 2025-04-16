import { useQuery } from "react-query";
import { BackendData, BaseEndpointNames, customAxios } from "../api";
const baseEndpointName = BaseEndpointNames.AUTH;

export const queryKeysAuth = {
  authorizeUrl: "authorize-url",
  discordInviteUrl: "discord-invite-url",
  auth: "auth",
};

export const fetchAuthorizeUrl = async (): Promise<BackendData<string>> => {
  const response = await customAxios.get(`/${baseEndpointName}/authorize-url`);
  return response.data;
};
export const fetchDiscordInviteUrl = async (): Promise<BackendData<string>> => {
  const response = await customAxios.get(`/${baseEndpointName}/discord/invite`);
  return response.data;
};

export const useGetAuthorizeUrl = () => {
  return useQuery(queryKeysAuth.authorizeUrl, fetchAuthorizeUrl);
};

export const useGetDiscordInviteUrl = () => {
  return useQuery(queryKeysAuth.discordInviteUrl, fetchDiscordInviteUrl);
};
