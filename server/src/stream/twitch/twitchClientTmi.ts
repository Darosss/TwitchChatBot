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
  });

  return client;
};
export default clientTmi;
