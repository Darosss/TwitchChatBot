import useAxiosCustom, { IPagination } from "./ApiService";
import { IUser } from "./UserService";

export interface IMessage {
  _id: string;
  message: string;
  date: Date;
  owner: IUser;
  ownerUsername: string;
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
        url: `${baseUrl}/stream-session/${sessionId}`,
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
