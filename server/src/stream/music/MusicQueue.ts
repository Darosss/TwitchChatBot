import { musicLogger } from "@utils";
import { QueueHandler } from "../QueueHandler";
import { ItemMusicQueue } from "./types";

class MusicQueue extends QueueHandler<ItemMusicQueue> {
  constructor() {
    super();
  }

  public removeFromQueById(songId: string) {
    const index = this.items.findIndex(({ id }) => id === songId);

    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  public getNextSongData() {
    if (this.getLength() < 1) {
      musicLogger.info(`No next song, current length: ${this.getLength()}`);
      return;
    }

    const nextItemData = this.items.at(0);
    return nextItemData;
  }

  public shouldPrepareQue(maxSongs: number) {
    if (this.getLength() < maxSongs) return true;
  }

  public getSongByUsername(username: string) {
    return this.items.find((data) => data.requester === username);
  }

  public getDurationTillFindUserSong(username: string) {
    let totalDuration = 0;
    this.getItems().every((songData) => {
      if (songData.requester !== username) {
        totalDuration += songData.duration;
        return true;
      }
    });

    return totalDuration;
  }
}

export { MusicQueue };
