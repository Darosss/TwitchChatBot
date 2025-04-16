import path from "path";
import { ensureDirectoryExists } from "@utils";

export const musicFolderName = "music";
export const rootFolder = path.resolve(__dirname, "../");
export const envFilePath = path.resolve(__dirname, "../../../.env");

export const publicEndpointName = "public";
export const publicEndpointPath = path.join(rootFolder, publicEndpointName);
export const achievementsPath = path.join(publicEndpointPath, "achievements");

export const badgesPath = path.join(achievementsPath, "badges");
export const achievementsStagesSoundsPath = path.join(achievementsPath, "stagesSounds");

export const musicPath = path.join(publicEndpointPath, musicFolderName);
export const alertSoundsFolderName = "alertSounds";
export const alertSoundsPath = path.join(publicEndpointPath, alertSoundsFolderName);
export const ytMusicFolderName = "youtube";
export const ytMusicPath = path.join(musicPath, ytMusicFolderName);

ensureDirectoryExists(musicPath);
ensureDirectoryExists(ytMusicPath);
ensureDirectoryExists(alertSoundsPath);
ensureDirectoryExists(achievementsPath);
ensureDirectoryExists(badgesPath);
ensureDirectoryExists(achievementsStagesSoundsPath);
