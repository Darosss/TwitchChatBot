import useAxiosCustom, { IPagination } from "./Api.service";

export interface IRedemption {
  _id: string;
  rewardId: string;
  userId: string;
  twitchId: string;
  userName: string;
  userDisplayName: string;
  redemptionDate: Date;
  rewardTitle: string;
  rewardCost: number;
  rewardImage: string;
  message?: string;
}

const getRedemptions = (
  redemptions: "all" | "session" | "user",
  sessionId: string | undefined,
  userId: string | undefined
) => {
  const baseUrl = "/redemptions";
  switch (redemptions) {
    case "session":
      return useAxiosCustom<IPagination<IRedemption>>({
        url: `${baseUrl}/twitch-session/${sessionId}`,
      });
      break;

    case "user":
      return useAxiosCustom<IPagination<IRedemption>>({
        url: `${baseUrl}/${userId}`,
      });
      break;

    default:
      return useAxiosCustom<IPagination<IRedemption>>({
        url: baseUrl,
      });
  }
};

export default { getRedemptions };
