import { ApiClient } from "@twurple/api/";
import { AuthorizedUserData } from "./types";

class HeadHandler {
  protected twitchApi: ApiClient;
  protected authorizedUser: AuthorizedUserData;

  constructor(twitchApi: ApiClient, authorizedUser: AuthorizedUserData) {
    this.twitchApi = twitchApi;
    this.authorizedUser = authorizedUser;
  }

  public updateProperties(twitchApi: ApiClient, authorizedUser: AuthorizedUserData) {
    this.twitchApi = twitchApi;
    this.authorizedUser = authorizedUser;
  }
}

export default HeadHandler;
