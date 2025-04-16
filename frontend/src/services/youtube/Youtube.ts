import { viteBackendUrl } from "@configs/envVariables";

export const getYoutubeStreamUrl = (id: string) =>
  `${viteBackendUrl}/youtube/videos/${id}`;
