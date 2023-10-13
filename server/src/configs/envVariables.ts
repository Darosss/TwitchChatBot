import * as dotenv from "dotenv";
import { envFilePath } from "./globalPaths";
dotenv.config({ path: envFilePath });

export const {
  HOST_FRONTEND_URL: hostFrontendURL,
  LOCAL_FRONTEND_URL: localFrontendURL,
  BACKEND_PORT: backendPort,
  CLIENT_ID: clientId,
  CLIENT_SECRET: clientSecret,
  YOUTUBE_API_KEY_V3: youtubeApiKeyV3,
  ENCRYPTION_KEY: encryptionKey,
  REDIRECT_URL: redirectUrl,
  DATABASE_CONNECT_URL: databaseConnectURL,
  BOT_USERNAME: botUsername,
  BOT_PASSWORD: botPassword,
  BOT_ID: botId,
  NODE_ENV: nodeEnv
} = process.env;
