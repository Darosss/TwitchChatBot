import useAxiosCustom, { IPagination, ResponseData } from "./Api.service";
import { IUser } from "./User.service";

export interface IMessage {
  _id: string;
  message: string;
  date: Date;
  owner: IUser;
}
interface FirstAndLatestMsgs {
  firstMessages: IMessage[];
  latestMessages: IMessage[];
}
const getMessages = (
  messages: "all" | "session" | "user",
  sessionId: string | undefined,
  userId: string | undefined
) => {
  const baseUrl = "/messages";
  switch (messages) {
    case "session":
      return useAxiosCustom<IPagination<IMessage>>({
        url: `${baseUrl}/twitch-session/${sessionId}`,
      });
      break;

    case "user":
      return useAxiosCustom<IPagination<IMessage>>({
        url: `${baseUrl}/${userId}`,
      });
      break;

    default:
      return useAxiosCustom<IPagination<IMessage>>({
        url: baseUrl,
      });
  }
};

const getLatestAndFirstMsgs = (userId: string) => {
  return useAxiosCustom<{ data: FirstAndLatestMsgs }>({
    url: `/messages/${userId}/latest-first-msgs`,
  });
};

export default { getMessages, getLatestAndFirstMsgs };
