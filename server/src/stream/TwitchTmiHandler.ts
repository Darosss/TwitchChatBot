import tmi, { Client } from "tmi.js";

interface ClientTmiOptions {
  userToListen: string;
  password: string;
  username: string;
}

// const clientTmi = (params: ClientTmiParams) => {
//   const { userToListen } = params;

//   const client = new tmi.Client({
//     options: { debug: false },
//     connection: {
//       secure: true,
//       reconnect: true,
//     },
//     identity: {
//       password: process.env.bot_password,
//       username: process.env.bot_username,
//     },
//     channels: [userToListen],
//   });

//   return client;
// };

class ClientTmiHandler {
  private static instance: ClientTmiHandler;
  private userToListen: string;
  private clientTmi: Client;

  constructor(options: ClientTmiOptions) {
    this.userToListen = options.userToListen;
    this.clientTmi = new tmi.Client({
      options: { debug: false },
      connection: {
        secure: true,
        reconnect: true,
      },
      identity: {
        password: options.password,
        username: options.username,
      },
      channels: [options.userToListen],
    });
    this.connect();
    const readyState = this.clientTmi.readyState();
    console.log(readyState);
  }

  public static getInstance(options: ClientTmiOptions): ClientTmiHandler {
    if (!ClientTmiHandler.instance) {
      console.log("TMI - No class so new");
      ClientTmiHandler.instance = new ClientTmiHandler(options);
    } else {
      // console.log("update options");
      // ClientTmiHandler.instance.updateOptions(options);
    }
    console.log("TMI - Class is so just return existing");
    return ClientTmiHandler.instance;
  }

  public connect() {
    this.clientTmi.connect();
  }

  // public updateOptions(options: ClientTmiHandler): void {

  //   // additional logic to update the instance with the new options
  // }

  public say(message: string) {
    this.clientTmi.say(this.userToListen, message);
  }

  public onMessageEvent(
    callback: (
      channel: string,
      userstate: tmi.ChatUserstate,
      message: string,
      self: boolean
    ) => void
  ) {
    this.clientTmi.on("message", async (channel, userstate, message, self) => {
      callback(channel, userstate, message, self);
    });
  }
}

export default ClientTmiHandler;
