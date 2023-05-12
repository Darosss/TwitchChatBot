import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@socket";
import { Server } from "socket.io";
import { ApiClient, HelixPrivilegedUser } from "@twurple/api/";

class HeadHandler {
  protected socketIO: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;
  protected twitchApi: ApiClient;
  protected authorizedUser: HelixPrivilegedUser;

  constructor(
    socket: Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >,
    twitchApi: ApiClient,
    authorizedUser: HelixPrivilegedUser
  ) {
    this.socketIO = socket;
    this.twitchApi = twitchApi;
    this.authorizedUser = authorizedUser;
  }

  public updateProperties(
    twitchApi: ApiClient,
    authorizedUser: HelixPrivilegedUser
  ) {
    this.twitchApi = twitchApi;
    this.authorizedUser = authorizedUser;
  }
}

export default HeadHandler;
