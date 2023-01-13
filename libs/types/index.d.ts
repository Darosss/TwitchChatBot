interface ServerToClientEvents {
  noArg: () => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  messageServer: (date: Date, username: string, message: string) => void;
}

interface ClientToServerEvents {
  messageClient: (date: Date, username: string, message: string) => void;
}

interface InterServerEvents {
  ping: () => void;
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
