import { ChatCommandCreateData } from "@services/chatCommands/types";

export const getDefaultChatCommands = () => {
  const defaultCommands: ChatCommandCreateData[] = [
    {
      name: "messages",
      messages: ["@$user{username}, your messages: $user{messageCount}"],
      aliases: ["messages", "msgs", "msg"],
      description: "Send information about user's message count"
    },
    {
      name: "points",
      messages: ["@$user{username}, your points: $user{points}"],
      aliases: ["pts", "points"],
      description: "Send information about user's points"
    },
    {
      name: "example",
      messages: ["This is example command message 1", "This is example command message 2"],
      aliases: ["example", "exampleCommand"],
      description: "Example command description"
    }
  ];
  return defaultCommands;
};
