import { Server as IOServer, Socket } from "socket.io";
import {
  ClientToServerEvents,
  ObtainAchievementDataWithCollectedAchievement,
  ObtainAchievementDataWithProgressOnly,
  ServerToClientEvents
} from "./types";
import { Server } from "http";
import { hostFrontendURL, localFrontendURL } from "@configs";
import { ConfigManager } from "../stream/ConfigManager";

//TODO: duplicate function is in frontend utils
export const isObtainedAchievement = (
  data: ObtainAchievementDataWithCollectedAchievement | ObtainAchievementDataWithProgressOnly
): data is ObtainAchievementDataWithCollectedAchievement => {
  return (
    (data as ObtainAchievementDataWithCollectedAchievement).stage !== undefined &&
    (data as ObtainAchievementDataWithCollectedAchievement).stage !== null
  );
};

type EventCallback = (...args: any[]) => void | Promise<void>;

type ClientToServerEventsKeys = keyof ClientToServerEvents;

class SocketHandler {
  private io: IOServer<ClientToServerEvents, ServerToClientEvents>;
  private static instance: SocketHandler;
  private connectedSockets: Set<Socket<ClientToServerEvents, ServerToClientEvents>> = new Set();
  private subscriptionsFromClient: Map<ClientToServerEventsKeys, EventCallback[]> = new Map();
  private constructor(httpServer: Server) {
    this.io = new IOServer(httpServer, { cors: { origin: [localFrontendURL, hostFrontendURL] } });

    this.setupSocketConnection();
  }

  public static getInstance(httpServer?: Server) {
    if (!SocketHandler.instance) {
      if (!httpServer) throw new Error("httpServer must be provided for the first initialization");
      SocketHandler.instance = new SocketHandler(httpServer);
    }
    return SocketHandler.instance;
  }

  public getConnectedSockets() {
    return this.connectedSockets;
  }

  public getIO(): IOServer<ClientToServerEvents, ServerToClientEvents> {
    return this.io;
  }

  private setupSocketConnection(): void {
    const configInstance = ConfigManager.getInstance();
    this.io.on("connection", (socket) => {
      this.connectedSockets.add(socket);

      socket.on("refreshOverlayLayout", (id) => this.io.emit("refreshOverlayLayout", id));

      socket.on("saveConfigs", () => {
        ConfigManager.getInstance().updateConfig();
      });

      socket.on("disconnect", () => {
        this.connectedSockets.delete(socket);
      });

      this.handleSubscriptionsFromClient(socket);
    });
  }

  private handleSubscriptionsFromClient(socket: any): void {
    this.subscriptionsFromClient.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        socket.on(event, (data: any) => {
          callback(data);
          console.log("Triggered socket event: ", event);
        });
      });
    });
  }

  /**
   *
   * @param event
   * @param callback
   * @param ovveride - should ovveride existing subscription (default false = pushes new event to existing events)
   */

  public subscribe(event: ClientToServerEventsKeys, callback: EventCallback, ovveride = false): void {
    if (!this.subscriptionsFromClient.has(event) || ovveride) {
      this.subscriptionsFromClient.set(event, []);
    }
    this.subscriptionsFromClient.get(event)?.push(callback);
  }
  public setupEventsOnConnection() {}
}

export { SocketHandler };
