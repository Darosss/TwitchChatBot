const TwitchApi = require("node-twitch").default;
class TwApi {
  constructor(id, secret) {
    this.twApi = new TwitchApi({
      client_id: id,
      client_secret: secret,
    });
  }
  async getUserId(loginName) {
    const users = await this.twApi.getUsers(loginName);
    const user = users.data[0];
    const userId = user.id;
    return userId;
  }
  async getRandomFollower(channel) {
    return await this.twApi
      .getFollows({
        to_id: (await this.getUserId(channel)).toString(),
      })
      .then((result) => {
        var random = Math.floor(Math.random() * result.data.length);
        return result.data[random];
      });
  }
  async isFollowing(broadcaster, chatter) {
    return await this.twApi
      .getFollows({
        to_id: (await this.getUserId(broadcaster)).toString(),
        from_id: await (await this.getUserId(chatter)).toString(),
      })
      .then((result) => {
        if (result.total <= 0) return true;
        else return false;
      });
  }
}

module.exports = TwApi;
