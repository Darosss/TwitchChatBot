import tmi, { Client } from "tmi.js";

interface ClientTmiOptions {
  userToListen: string;
  password: string;
  username: string;
}

// NOTE:
// - ClientTmiHandler is containg two Clients for one reason
// - twitch does not sends back info about emotes, ids etc. for sent bot messages
// - way around is to create one sender and one receiver client

class ClientTmiHandler {
  private userToListen: string;
  private clientTmi: Client;
  private clientTmiAsSender: Client;

  constructor(options: ClientTmiOptions) {
    this.userToListen = options.userToListen;
    const clientOptions: tmi.Options = {
      connection: { secure: true, reconnect: true },
      identity: { password: options.password, username: options.username },
      channels: [options.userToListen]
    };
    this.clientTmi = new tmi.Client(clientOptions);
    this.clientTmiAsSender = new tmi.Client(clientOptions);
    this.connect();
  }

  public async disconnectTmi() {
    await this.disconnectTmiDependsIfConnected(this.clientTmi);
    await this.disconnectTmiDependsIfConnected(this.clientTmiAsSender);
  }
  private async disconnectTmiDependsIfConnected(client: Client) {
    const readyState = client.readyState();
    if (readyState === "CONNECTING" || readyState === "OPEN") {
      await client.disconnect();
    }
  }

  public async updateOptions(options: ClientTmiOptions): Promise<void> {
    const { userToListen, password, username } = options;
    this.userToListen = userToListen;

    await this.disconnectTmi();

    this.clientTmi = new tmi.Client({
      options: { debug: true },
      connection: { secure: true, reconnect: true },
      identity: { password: password, username: username },
      channels: [options.userToListen]
    });
    await this.connect();
  }

  public async connect() {
    await this.clientTmi.connect();
    await this.clientTmiAsSender.connect();
  }

  public say(message: string) {
    this.clientTmiAsSender.say(this.userToListen, message);
  }

  public onMessageEvent(
    callback: (channel: string, userstate: tmi.ChatUserstate, message: string, self: boolean) => void
  ) {
    this.clientTmi.on("message", async (channel, userstate, message, self) => {
      callback(channel, userstate, message, self);
    });
  }

  public onDeleteMessageEvent(
    callback: (channel: string, username: string, userstate: tmi.DeleteUserstate, deletedMessage: string) => void
  ) {
    this.clientTmi.on("messagedeleted", (channel, username, deletedMessage, userstate) => {
      callback(channel, username, userstate, deletedMessage);
    });
  }
}

export default ClientTmiHandler;
