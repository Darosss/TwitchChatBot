import path from "path";

export const envFilePath = path.resolve(__dirname, "../../../.env");

export const publicPath = path.resolve(__dirname, "../public");

export const musicPath = path.join(publicPath, "music");
export const alertSoundsPath = path.join(publicPath, "alertSounds");
export const achievementsPath = path.join(publicPath, "achievements");
export const badgesPath = path.join(achievementsPath, "badges");
export const achievementsStagesSoundsPath = path.join(achievementsPath, "stagesSounds");
