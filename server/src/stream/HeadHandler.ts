import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@libs/types";
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
  authorizedUser: HelixPrivilegedUser;

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
}

export default HeadHandler;