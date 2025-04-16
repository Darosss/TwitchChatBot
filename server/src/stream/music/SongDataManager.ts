import { AudioStreamData } from "@socket";
import moment from "moment";

export class SongDataManager {
  private currentSong: AudioStreamData | null = null;
  private previousSong: AudioStreamData | null = null;
  private currentSongStart: Date | null = null;
  private songHistory: AudioStreamData[] = [];
  constructor() {}

  public setCurrentSong(song: AudioStreamData | null) {
    if (this.currentSong) {
      this.previousSong = this.currentSong;
      this.songHistory.push(this.currentSong);
    }
    this.currentSong = song;
  }

  public updateCurrentSong(data: Partial<AudioStreamData>) {
    if (!this.currentSong) return;
    this.currentSong = { ...this.currentSong, ...data };
  }

  public updateCurrentSongStart(date?: Date) {
    this.setCurrentSongStart(date ? date : new Date());
  }

  public setCurrentSongStart(date: Date | null) {
    this.currentSongStart = date;
  }

  public getCurrentTimeSong() {
    const currentTimeSong = moment().diff(this.getCurrentSongStart(), "seconds");
    return isNaN(currentTimeSong) ? 0 : currentTimeSong;
  }

  public getCurrentSongStart() {
    return this.currentSongStart;
  }

  public getCurrentSong(updateCurrentTime?: boolean): AudioStreamData | null {
    if (!updateCurrentTime) return this.currentSong;

    this.updateCurrentSong({ currentTime: this.getCurrentTimeSong() });
    return this.currentSong;
  }

  public getPreviousSong() {
    return this.previousSong;
  }

  public getSongHistory() {
    return this.songHistory;
  }

  public clearHistory() {
    this.songHistory = [];
  }
}
