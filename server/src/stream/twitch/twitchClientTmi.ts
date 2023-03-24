import tmi from "tmi.js";

interface ClientTmiParams {
  userToListen: string;
}

const clientTmi = (params: ClientTmiParams) => {
  const { userToListen } = params;

  const client = new tmi.Client({
    options: { debug: false },
    connection: {
      secure: true,
      reconnect: true,
    },
    identity: {
      password: process.env.password,
      username: process.env.username,
    },
    channels: [userToListen],
    logger: {
      info(message) {
        console.log(
          `${new Date().toISOString().split("T")[1].split(".")[0]} ${message}`
        );
      },
      warn(message) {
        console.log("WARN", message);
      },
      error(message) {
        console.log("ERROR", message);
      },
    },
  });

  return client;
};
export default clientTmi;
