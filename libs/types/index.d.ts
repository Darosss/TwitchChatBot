interface ServerToClientEvents {
  noArg: () => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  messageServer: (date: Date, username: string, message: string) => void;
  playRedemptionSound: (data: ISoundData) => void;
}

interface ClientToServerEvents {
  messageClient: (date: Date, username: string, message: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface ISoundData {
  rewardId: string;
  userId: string;
  userDisplayName: string;
  redemptionDate: Date;
  rewardTitle: string;
  rewardCost: number;
  rewardImage: { url_1x: string; url_2x: string; url_4x: string };
  message: string;
}

interface SocketData {
  name: string;
  age: number;
}

export {
  ClientToServerEvents,
  SocketData,
  InterServerEvents,
  ServerToClientEvents,
};
