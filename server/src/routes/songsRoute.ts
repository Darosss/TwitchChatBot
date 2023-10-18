import { Router } from "express";
import { checkSearchParams, isParamObjectId } from "@middlewares";
import { addNewSong, editSongById, getSongsList, deleteSongById } from "@controllers";

const songsRouter = Router();

songsRouter.get("/", checkSearchParams, getSongsList);
songsRouter.post("/create", addNewSong);
songsRouter.post("/:id", isParamObjectId, editSongById);
songsRouter.delete("/delete/:id", isParamObjectId, deleteSongById);

export default songsRouter;
