import { SocketServer } from "@libs/types";
import { ApiClient, HelixPrivilegedUser } from "@twurple/api/";

class HeadHandler {
  protected socketIO: SocketServer;
  protected twitchApi: ApiClient;
  authorizedUser: HelixPrivilegedUser;

  constructor(
    socket: SocketServer,
    twitchApi: ApiClient,
    authorizedUser: HelixPrivilegedUser
  ) {
    this.socketIO = socket;
    this.twitchApi = twitchApi;
    this.authorizedUser = authorizedUser;
  }
}

export default HeadHandler;
