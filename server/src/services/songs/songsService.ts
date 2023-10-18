import { checkExistResource, AppError, handleAppError, logger } from "@utils";
import { FilterQuery, UpdateQuery } from "mongoose";
import {
  ManageSongLikesAction,
  ManySongsFindOptions,
  SongsCreateData,
  SongsFindOptions,
  SongsUpdateData
} from "./types";
import { SongsDocument, Songs } from "@models";

export const getSongs = async (filter: FilterQuery<SongsDocument> = {}, songsFindOptions: ManySongsFindOptions) => {
  const { limit = 50, skip = 1, sort = { createdAt: 1 }, select = { __v: 0 }, populate = [] } = songsFindOptions;

  try {
    const songs = await Songs.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .populate(populate)
      .sort(sort);

    return songs;
  } catch (err) {
    logger.error(`Error occured while getting songs. ${err}`);
    handleAppError(err);
  }
};

export const getSongsCount = async (filter: FilterQuery<SongsDocument> = {}) => {
  return await Songs.countDocuments(filter);
};

export const createSong = async (createData: SongsCreateData) => {
  const foundSong = await getOneSong({ youtubeId: createData.youtubeId }, {});
  if (foundSong) return foundSong;

  try {
    const createdSong = await Songs.create(createData);

    if (!createdSong) {
      throw new AppError(400, "Couldn't create new song(s");
    }
    return createdSong;
  } catch (err) {
    logger.error(`Error occured while creating song(s). ${err}`);
    handleAppError(err);
  }
};

export const updateSongs = async (
  filter: FilterQuery<SongsDocument> = {},
  updateData: UpdateQuery<SongsUpdateData>
) => {
  try {
    await Songs.updateMany(filter, updateData, {
      new: true
    });
  } catch (err) {
    logger.error(`Error occured while updating many songs. ${err}`);
    handleAppError(err);
  }
};

export const updateSongById = async (id: string, updateData: UpdateQuery<SongsUpdateData>) => {
  try {
    const updatedSong = await Songs.findByIdAndUpdate(id, updateData, {
      new: true
    });

    const songs = checkExistResource(updatedSong, `Song with id(${id})`);

    return songs;
  } catch (err) {
    logger.error(`Error occured while editing song by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const manageSongLikesByYoutubeId = async (youtubeId: string, action: ManageSongLikesAction, userId: string) => {
  try {
    const updatedSong = await Songs.findOneAndUpdate(
      { youtubeId: youtubeId },
      { $set: { [`likes.${userId}`]: action === "like" ? 1 : action === "dislike" ? -1 : 0 } },
      { new: true }
    );

    const songs = checkExistResource(updatedSong, `Song with youtubeId(${youtubeId})`);

    return songs;
  } catch (err) {
    logger.error(`Error occured while editing song by youtubeId(${youtubeId}). ${err}`);
    handleAppError(err);
  }
};

export const deleteSongById = async (id: string) => {
  try {
    const deletedSong = await Songs.findByIdAndDelete(id);

    const songs = checkExistResource(deletedSong, `Song with id(${id})`);

    return songs;
  } catch (err) {
    logger.error(`Error occured while deleting song by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const getSongById = async (id: string, filter: FilterQuery<SongsDocument> = {}) => {
  try {
    const foundSong = await Songs.findById(id, filter);

    const songs = checkExistResource(foundSong, `Song with id(${id})`);

    return songs;
  } catch (err) {
    logger.error(`Error occured while getting song: ${err}`);
    handleAppError(err);
  }
};

export const getOneSong = async (filter: FilterQuery<SongsDocument> = {}, songsFindOptions: SongsFindOptions) => {
  const { populate = [], select = { __v: 0 } } = songsFindOptions;
  try {
    const foundSong = await Songs.findOne(filter).select(select).populate(populate);

    return foundSong;
  } catch (err) {
    logger.error(`Error occured while getting songs: ${err}`);
    handleAppError(err);
  }
};
