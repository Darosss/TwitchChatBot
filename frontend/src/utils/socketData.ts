import { MessageServerData } from "@socketTypes";

type GetMessagesWithEmotesParams = Pick<
  MessageServerData["messageData"],
  "message" | "emotes"
>;

interface GetMessagesWithEmotesReturnType {
  value: string;
  emoteId?: string;
}

type GetMessagesWithEmotesFn = (
  params: GetMessagesWithEmotesParams
) => GetMessagesWithEmotesReturnType[] | undefined;

enum TwitchEmoteUrlTheme {
  DARK = "dark",
  LIGHT = "light",
}

enum TwitchEmoteUrlScale {
  x1 = "1.0",
  x2 = "2.0",
  x3 = "3.0",
}

interface GetTwitchEmoteUrlParams {
  id: string;
  theme?: TwitchEmoteUrlTheme;
  scale?: TwitchEmoteUrlScale;
}

type GetTwitchEmoteUrlFn = (params: GetTwitchEmoteUrlParams) => string;

export const getTwitchEmoteUrl: GetTwitchEmoteUrlFn = ({
  id,
  theme = TwitchEmoteUrlTheme.DARK,
  scale = TwitchEmoteUrlScale.x1,
}) =>
  `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/${theme}/${scale}`;

export const getMessagesWithEmotes: GetMessagesWithEmotesFn = ({
  message,
  emotes,
}) => {
  if (!emotes) return;
  const emoteIds = Object.keys(emotes);
  let currentIndex = 0;
  const emotesSortedIndexes = emoteIds
    .map((emoteId) =>
      emotes[emoteId].map((value) => {
        const [startIndex, endIndex] = value.split("-").map(Number);
        return { startIndex, endIndex, emoteId };
      })
    )
    .flat()
    .sort((a, b) => a.startIndex - b.startIndex);

  const messagesAndEmotes: { emoteId?: string; value: string }[] = [];

  emotesSortedIndexes.forEach(({ startIndex, endIndex, emoteId }) => {
    if (startIndex > currentIndex) {
      messagesAndEmotes.push({
        value: message.slice(currentIndex, startIndex),
      });
    }

    messagesAndEmotes.push({
      emoteId: emoteId,
      value: message.slice(startIndex, endIndex + 1),
    });
    currentIndex = endIndex + 1;
  });

  if (currentIndex < message.length)
    messagesAndEmotes.push({
      value: message.slice(currentIndex, message.length),
    });

  return messagesAndEmotes;
};
