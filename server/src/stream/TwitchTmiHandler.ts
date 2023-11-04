import tmi, { Client } from "tmi.js";

interface ClientTmiOptions {
  userToListen: string;
  password: string;
  username: string;
}

class ClientTmiHandler {
  private userToListen: string;
  private clientTmi: Client;

  constructor(options: ClientTmiOptions) {
    this.userToListen = options.userToListen;
    this.clientTmi = new tmi.Client({
      options: { debug: true },
      connection: { secure: true, reconnect: true },
      identity: { password: options.password, username: options.username },
      channels: [options.userToListen]
    });
    this.connect();
  }

  public async disconnectTmi() {
    const readyState = this.clientTmi.readyState();
    if (readyState === "CONNECTING" || readyState === "OPEN") {
      await this.clientTmi.disconnect();
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
  }

  public say(message: string) {
    this.clientTmi.say(this.userToListen, message);
  }

  public onMessageEvent(
    callback: (channel: string, userstate: tmi.ChatUserstate, message: string, self: boolean) => void
  ) {
    this.clientTmi.on("message", async (channel, userstate, message, self) => {
      callback(channel, userstate, message, self);
    });
  }
}

export default ClientTmiHandler;
