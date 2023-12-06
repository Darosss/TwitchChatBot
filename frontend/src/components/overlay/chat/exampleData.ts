import { MessageServerData } from "@socketTypes";
import { randomWithMax } from "@utils";
import moment from "moment";
import { commonData } from "../commonExampleData";

const simpleMessageData = [
  "hi there, how are you doing? hey, want to grab coffee later?",
  "Hello! I'm doing great, thanks for asking.",
  "hey, want to grab coffee later?",
  "Sure thing! Coffee sounds good.",
  "HEY! WHAT'S UP?",
  "Not much, just chilling. You?",
  "long time no see...",
  "Yeah, it's been a while. How have you been?",
  "quick question: movie night this weekend?",
  "Definitely! I'm in. Any movie preferences?",
  "So, did you hear the news?",
  "No, what's the scoop?",
  "I'm thinking of trying out a new restaurant. Interested?",
  "Absolutely! I love trying new places.",
  "See you at 7pm. Don't be late!",
];

const generateRandomMessageServerData = (index: number): MessageServerData => {
  return {
    messageData: {
      emotes: undefined,
      id: Math.random().toString(),
      message: simpleMessageData[randomWithMax(simpleMessageData.length - 1)],
      timestamp: moment().add(index, "second").toDate().getTime(),
    },
    user: {
      _id: Math.random().toString(),
      badgesPaths: ["", "", ""],
      username:
        commonData.nicknames[randomWithMax(commonData.nicknames.length - 1)],
    },
  };
};

export const getExampleChatData = (length = 15): MessageServerData[] => {
  return Array(length)
    .fill(0)
    .map((val, index) => generateRandomMessageServerData(index + 1));
};
