import { ApiClient, HelixClip } from "@twurple/api";
import { StaticAuthProvider } from "@twurple/auth";

class TwitchApi {
  apiClient: ApiClient;
  constructor(authProvider: StaticAuthProvider) {
    this.apiClient = new ApiClient({ authProvider });
  }

  async getUserID(userName: string) {
    const user = await this.apiClient.users.getUserByName(userName);
    if (user) return user.id;
    return null;
  }

  async streamLiveInfo(userName: string) {
    const user = await this.apiClient.users.getUserByName(userName);
    if (user === null) {
      return false;
    }

    return await this.apiClient.streams.getStreamByUserId(user.id);
  }
}

export default TwitchApi;
