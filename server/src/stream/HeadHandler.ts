import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "@socket";
import { Server } from "socket.io";
import { ApiClient } from "@twurple/api/";
import { AuthorizedUserData } from "./types";

class HeadHandler {
  protected socketIO: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
  protected twitchApi: ApiClient;
  protected authorizedUser: AuthorizedUserData;

  constructor(
    socket: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
    twitchApi: ApiClient,
    authorizedUser: AuthorizedUserData
  ) {
    this.socketIO = socket;
    this.twitchApi = twitchApi;
    this.authorizedUser = authorizedUser;
  }

  public updateProperties(twitchApi: ApiClient, authorizedUser: AuthorizedUserData) {
    this.twitchApi = twitchApi;
    this.authorizedUser = authorizedUser;
  }
}

export default HeadHandler;
