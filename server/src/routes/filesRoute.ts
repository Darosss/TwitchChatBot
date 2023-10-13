import { Router } from "express";
import {
  uploadMp3File,
  getFoldersList,
  getFolderMp3Files,
  deleteMp3File,
  createAudioFolder,
  deleteAudioFolder,
  getAlertSoundsList,
  uploadAlertSound,
  deleteAlertSound
} from "@controllers";
const filesRouter = Router();

filesRouter.get("/folder-list", getFoldersList);
filesRouter.get("/audio/alertSounds", getAlertSoundsList);
filesRouter.get("/audio/:folder", getFolderMp3Files);
filesRouter.post("/upload/alertSounds", uploadAlertSound);
filesRouter.post("/upload/audio-mp3/:folder", uploadMp3File);
filesRouter.post("/create/audio/:folder", createAudioFolder);
filesRouter.delete("/delete/alertSounds/:fileName", deleteAlertSound);
filesRouter.delete("/delete/audio/:folder/:fileName", deleteMp3File);
filesRouter.delete("/delete/folder/audio/:folder", deleteAudioFolder);

export default filesRouter;
