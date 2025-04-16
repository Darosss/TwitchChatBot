import { SocketHandler } from "@socket";
import { getChunksFromStream } from "@utils";
import fs from "fs";

class StreamAudioLogic {
  private sendAudioChunkInterval?: NodeJS.Timeout;
  private currentIndexChunk = 0;
  private sendIntervalDelay = 1000;
  private currentChunks: (string | Buffer)[] = [];
  private shouldEmit: boolean = false;
  private readonly MINIMUM_BUFFERED_TIME = 10;
  constructor() {
    SocketHandler.getInstance().subscribe("sendBufferedInfo", (bufferedTime) => {
      if (bufferedTime > this.MINIMUM_BUFFERED_TIME) {
        this.shouldEmit = false;
      } else {
        this.shouldEmit = true;
      }
    });
  }

  public clearInterval() {
    clearInterval(this.sendAudioChunkInterval);
    this.sendAudioChunkInterval = undefined;
  }

  public startSendInterval() {
    const socketInstance = SocketHandler.getInstance();
    this.clearInterval();
    this.sendAudioChunkInterval = setInterval(() => {
      if (!this.shouldEmit) return;

      const chunkToSend = this.currentChunks.at(this.currentIndexChunk);

      if (!chunkToSend) {
        return this.stopEmiting(true);
      }

      socketInstance.getConnectedSockets().forEach((socket) => {
        socket.emit("audioChunk", { chunk: chunkToSend });
      });
      this.currentIndexChunk++;
    }, this.sendIntervalDelay);
  }

  private clearCurrentChunks() {
    this.currentChunks.splice(0, this.currentChunks.length);
  }

  private async prepareSongStream(absolutePath: string) {
    this.clearCurrentChunks();
    this.clearInterval();
    const songStream = fs.createReadStream(absolutePath);
    this.currentChunks = await getChunksFromStream(songStream);
  }

  public async startEmiting(absolutePath: string) {
    this.stopEmiting(true);
    await this.prepareSongStream(absolutePath);

    this.startSendInterval();
  }

  public stopEmiting(clear?: boolean) {
    this.clearInterval();
    if (clear) {
      this.currentIndexChunk = 0;
      this.clearCurrentChunks();
    }
  }
}

export default StreamAudioLogic;
