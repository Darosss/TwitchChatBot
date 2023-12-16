import { NextFunction, Request, Response } from "express";
import { RequestParams, RequestSongsQuery } from "@types";
import { filterSongsByUrlParams } from "./filters";
import {
  createSong,
  deleteSongById as deleteSongByIdService,
  getSongs,
  getSongsCount,
  updateSongById,
  SongsCreateData,
  SongsUpdateData
} from "@services";

export const getSongsList = async (req: Request<{}, {}, {}, RequestSongsQuery>, res: Response, next: NextFunction) => {
  const { page = 1, limit = 25, sortBy = "createdAt", sortOrder = "desc" } = req.query;

  const searchFilter = filterSongsByUrlParams(req.query);
  try {
    const songs = await getSongs(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      populate: [{ path: "whoAdded", select: { _id: 1, username: 1, twitchName: 1 } }],
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 }
    });

    const count = await getSongsCount(searchFilter);
    return res.status(200).send({
      data: songs,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

export const addNewSong = async (req: Request<{}, {}, SongsCreateData, {}>, res: Response, next: NextFunction) => {
  try {
    const newSong = await createSong(req.body);

    return res.status(201).send({ message: "Song added successfully", song: newSong });
  } catch (err) {
    next(err);
  }
};

export const editSongById = async (
  req: Request<RequestParams, {}, SongsUpdateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const {
    botUses,
    customId,
    customTitle,
    duration,
    enabled,
    lastUsed,
    likes,
    songRequestUses,
    title,
    usersUses,
    uses,
    whoAdded,
    youtubeId
  } = req.body;

  const updateData = {
    botUses,
    customId,
    customTitle,
    duration,
    enabled,
    lastUsed,
    likes,
    songRequestUses,
    title,
    usersUses,
    uses,
    whoAdded,
    youtubeId
  };
  try {
    const updatedSong = await updateSongById(id, updateData);

    return res.status(200).send({
      message: "Song updated successfully",
      data: updatedSong
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSongById = async (req: Request<RequestParams, {}, {}, {}>, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await deleteSongByIdService(id);

    return res.status(200).send({ message: "Song deleted successfully" });
  } catch (err) {
    next(err);
  }
};
