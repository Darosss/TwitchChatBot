import { ApiClient } from "@twurple/api";

const apiTwitch = (apiClient: ApiClient) => {
  async function getAuthUserId() {
    return (await apiClient.users.getMe()).id;
  }

  return { getAuthUserId };
};

// async getUserID(userName: string) {
//   const user = await this.apiClient.users.getUserByName(userName);
//   if (user) return user.id;
//   return null;
// }

// async streamLiveInfo(userName: string) {
//   const user = await this.apiClient.users.getUserByName(userName);
//   if (user === null) {
//     return false;
//   }

//   return await this.apiClient.streams.getStreamByUserId(user.id);
// }

export default apiTwitch;
