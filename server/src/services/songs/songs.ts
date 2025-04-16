import { checkExistResource, AppError, handleAppError, logger } from "@utils";
import mongoose, { FilterQuery, UpdateQuery } from "mongoose";
import {
  CreateSongReturn,
  ManageSongLikesAction,
  ManageSongLikesByIds,
  ManySongsFindOptions,
  SongsCreateData,
  SongsFindOptions,
  SongsUpdateData,
  UsesType
} from "./types";
import { SongsDocument, Songs, UserModel } from "@models";
import { getUserById } from "@services";

export const getSongs = async (filter: FilterQuery<SongsDocument> = {}, findOptions: ManySongsFindOptions) => {
  const { limit = 50, skip = 1, sort = { createdAt: 1 }, select = { __v: 0 }, populate = [] } = findOptions;

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

export const createSong = async (createData: SongsCreateData): Promise<CreateSongReturn | undefined> => {
  const { youtubeId, sunoId, downloadedData } = createData;
  const foundSong = await getOneSong(
    {
      $and: [
        ...(sunoId ? [{ sunoId: sunoId }] : []),
        ...(youtubeId ? [{ youtubeId: youtubeId }] : []),
        ...(!sunoId && !youtubeId && downloadedData?.fileName
          ? [{ "downloadedData.fileName": downloadedData.fileName }]
          : [])
      ]
      //TODO: add here to check if exisist as local
    },
    {}
  );

  if (foundSong) {
    const updatedSong = await updateSongById(foundSong._id, createData);
    return { isNew: false, song: updatedSong! };
  }

  const { whoAdded, ...rest } = createData;
  try {
    const foundCreator = checkExistResource(await getUserById(whoAdded, {}), "Creator of song");

    const modifiedCreateData = { ...rest, whoAdded: foundCreator as UserModel };
    const createdSong = await Songs.create(modifiedCreateData);

    if (!createdSong) {
      throw new AppError(400, "Couldn't create new song(s");
    }
    return { isNew: true, song: createdSong };
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

export const manageSongLikesById = async (id: ManageSongLikesByIds, action: ManageSongLikesAction, userId: string) => {
  const filter =
    "id" in id
      ? { _id: new mongoose.Types.ObjectId(id.id) }
      : {
          youtubeId: id.youtubeId
        };
  const songID = filter._id || filter.youtubeId;
  try {
    const updatedSong = await Songs.findOneAndUpdate(
      filter,
      { $set: { [`likes.${userId}`]: action === "like" ? 1 : action === "dislike" ? -1 : 0 } },
      { new: true }
    );

    const songs = checkExistResource(updatedSong, `Song with id(${songID})`);

    return songs;
  } catch (err) {
    logger.error(`Error occured while editing song by youtubeId(${songID}). ${err}`);
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

export const getOneSong = async (filter: FilterQuery<SongsDocument> = {}, findOptions?: SongsFindOptions) => {
  const { populate = [], select = { __v: 0 } } = findOptions || {};
  try {
    const foundSong = await Songs.findOne(filter).select(select).populate(populate);

    return foundSong;
  } catch (err) {
    logger.error(`Error occured while getting songs: ${err}`);
    handleAppError(err);
  }
};
export const updateSongUsesById = async (id: string, useType: UsesType) => {
  const incrementData = {
    botUses: useType === "botUses" ? 1 : 0,
    songRequestUses: useType === "songRequestUses" ? 1 : 0,
    uses: 1
  };
  try {
    const updatedSong = await Songs.findByIdAndUpdate(id, { $inc: incrementData }, { new: true });

    const song = checkExistResource(updatedSong, `Song with id(${id})`);

    return song;
  } catch (err) {
    logger.error(`Error occured while editing song by id(${id}). ${err}`);
    handleAppError(err);
  }
};
