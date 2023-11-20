import { ServerSocket } from "@socket";
import { CommandData } from "../discord";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HOST_FRONTEND_URL: string;
      LOCAL_FRONTEND_URL: string;
      BACKEND_PORT: string;
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      YOUTUBE_API_KEY_V3: string;
      ENCRYPTION_KEY: string;
      REDIRECT_URL: string;
      DATABASE_CONNECT_URL: string;
      BOT_USERNAME: string;
      BOT_PASSWORD: string;
      BOT_ID: string;
      DISCORD_CLIENT_TOKEN: string;
      DISCORD_CLIENT_ID: string;
      NODE_ENV: "development" | "production";
    }
  }
  namespace Express {
    interface Request {
      io: ServerSocket;
    }
  }
}

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, CommandData>;
  }
}
