import { youtubeApiKeyV3 } from "@configs";
import { musicLogger } from "@utils";
import { google, youtube_v3 } from "googleapis";

class YoutubeApiHandler {
  private youtube: youtube_v3.Youtube;

  constructor(customAuth?: string) {
    this.youtube = google.youtube({
      version: "v3",
      auth: customAuth ? customAuth : youtubeApiKeyV3
    });
  }

  public async searchYoutubePlaylistByName(name: string, maxResults: number) {
    try {
      const foundPlaylist = await this.youtube.search.list({
        part: ["id", "snippet"],
        q: name,
        type: ["playlist"],
        maxResults
      });
      const playlist = foundPlaylist.data.items;
      if (!playlist) return;
      const playlistData = playlist
        ?.filter((data) => data.id?.playlistId && data.snippet?.title)
        ?.map(({ id, snippet }) => {
          const { title } = snippet!;
          const { playlistId } = id!;

          return { title: title!, playlistId: playlistId! };
        });
      if (playlist && playlist.length > 0) {
        return playlistData;
      }
    } catch (err) {
      musicLogger.error(`searchYoutubePlaylistByName -> ${err}`);
    }
  }

  public async getYoutubePlaylistById(id: string): Promise<youtube_v3.Schema$Playlist | undefined> {
    try {
      const foundPlaylist = await this.youtube.playlists.list({
        part: ["id", "snippet", "contentDetails"],
        id: [id],
        maxResults: 1
      });

      const playlist = foundPlaylist.data.items;
      if (playlist && playlist.length > 0) {
        return playlist[0];
      }
    } catch (err) {
      musicLogger.error(`getYoutubePlaylistById -> ${err}`);
    }
  }

  private async getYoutubePlaylistItemsById(
    id: string,
    maxResults = 20
  ): Promise<youtube_v3.Schema$PlaylistItem[] | undefined> {
    try {
      const foundPlaylistItems = await this.youtube.playlistItems.list({
        part: ["id", "snippet", "status"],
        playlistId: id,
        maxResults: maxResults
      });

      return foundPlaylistItems.data.items;
    } catch (err) {
      musicLogger.error(`getYoutubePlaylistItemsById -> ${err}`);
      return [];
    }
  }

  public async getYoutubePlaylistVideosIds(id: string, maxResults = 20): Promise<string[]> {
    try {
      const playlistItems = await this.getYoutubePlaylistItemsById(id, maxResults);
      if (!playlistItems) return [];

      const videosIds = playlistItems.map((item) => {
        const privacyStatus = item.status?.privacyStatus;
        const videoId = item.snippet?.resourceId?.videoId;

        if (videoId && privacyStatus === "public") return videoId;
        return "";
      });

      return videosIds;
    } catch (err) {
      musicLogger.error(`getYoutubePlaylistVideosIds -> ${err}`);
      return [];
    }
  }

  public async getYoutubeVideosById(ids: string[], part?: string[]): Promise<youtube_v3.Schema$Video[] | undefined> {
    const videoDetails = await this.youtube.videos.list({
      part: part ? part : ["contentDetails", "snippet", "topicDetails"],
      id: ids
    });

    return videoDetails.data.items;
  }

  public async getYoutubeSearchVideosIds(opts: youtube_v3.Params$Resource$Search$List): Promise<string[] | undefined> {
    const { part = ["snippet"], q, maxResults = 1, videoCategoryId = "10" } = opts;
    const searchResult = await this.youtube.search.list({
      part: part,
      q: q,
      type: ["video"],
      videoEmbeddable: "true",
      videoCategoryId: videoCategoryId,
      maxResults: maxResults
    });

    const items = searchResult.data.items;

    const videosIds = items?.map((item) => {
      const videoId = item.id?.videoId;

      if (videoId) return videoId;
      return "";
    });

    return videosIds;
  }
}

const youtubeApiHandler = new YoutubeApiHandler();
export { YoutubeApiHandler };
export default youtubeApiHandler;
