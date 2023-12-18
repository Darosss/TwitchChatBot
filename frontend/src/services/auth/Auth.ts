import useAxiosCustom, { ResponseData } from "../api";

export const useGetAuthorizeUrl = () => {
  return useAxiosCustom<ResponseData<string>>({
    url: `/auth/authorize-url`,
  });
};

export const useGetDiscordInviteUrl = () => {
  return useAxiosCustom<ResponseData<string>>({
    url: `/auth/discord/invite`,
  });
};
