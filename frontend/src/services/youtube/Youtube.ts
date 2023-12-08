import { viteBackendUrl } from "src/configs/envVariables";

export const getYoutubeStreamUrl = (id: string) =>
  `${viteBackendUrl}/youtube/videos/${id}`;
