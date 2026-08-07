/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { SongCreateData, SongModel } from "@models";

jest.mock("@models", () => ({
  Songs: {
    find: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn()
  }
}));

jest.mock("@services", () => ({
  getUserById: jest.fn()
}));

import { Songs } from "@models";
import { getUserById } from "@services";
import * as SongsService from "./songs";

const createFakeSong = (): SongModel => ({
  _id: "song-1",
  title: "Test Song",
  youtubeId: "youtube-1",
  whoAdded: "user-1",
  likes: {},
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  customTitle: {
    band: "Test Band",
    title: "Test Title"
  },
  duration: 300,
  uses: 0,
  usersUses: {},
  botUses: 0,
  songRequestUses: 0,
  enabled: false,
  tags: ""
});

describe("Songs Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getSongs", () => {
    it("should query songs with pagination and return the result", async () => {
      const fakeSongs = [createFakeSong()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakeSongs as never)
      };

      const findSpy = jest.spyOn(Songs, "find").mockReturnValue(queryChain as any);

      const result = await SongsService.getSongs(
        {},
        { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 }, populate: ["user"] }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.populate).toHaveBeenCalledWith(["user"]);
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeSongs);
    });
  });

  describe("getSongsCount", () => {
    it("should return the count of songs for a filter", async () => {
      const countSpy = jest.spyOn(Songs, "countDocuments").mockResolvedValue(4 as any);

      const result = await SongsService.getSongsCount({ title: "Test Song" });

      expect(countSpy).toHaveBeenCalledWith({ title: "Test Song" });
      expect(result).toBe(4);
    });
  });

  describe("createSong", () => {
    it("should create a new song for a valid creator", async () => {
      const fakeSong = createFakeSong();
      const queryChain = {
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(null as never)
      };
      jest.spyOn(Songs, "findOne").mockReturnValue(queryChain as any);
      jest.spyOn(Songs, "create").mockResolvedValue(fakeSong as any);
      jest.mocked(getUserById).mockResolvedValue({ _id: "user-1" } as any);

      const createData: SongCreateData = {
        title: "Test Song",
        youtubeId: "youtube",
        whoAdded: "user-1",
        duration: 300
      };

      const result = await SongsService.createSong(createData);

      expect(getUserById).toHaveBeenCalledWith("user-1", { select: { _id: true } });
      expect(Songs.create).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Test Song", whoAdded: "user-1", youtubeId: "youtube" })
      );
      expect(result).toEqual({ isNew: true, song: fakeSong });
    });
  });

  describe("updateSongs", () => {
    it("should update many songs for a filter", async () => {
      const updateSpy = jest.spyOn(Songs, "updateMany").mockResolvedValue({ acknowledged: true } as any);

      await SongsService.updateSongs({ title: "Test Song" }, { $set: { title: "Updated" } });

      expect(updateSpy).toHaveBeenCalledWith({ title: "Test Song" }, { $set: { title: "Updated" } });
    });
  });

  describe("updateSongById", () => {
    it("should return the updated song by id", async () => {
      const fakeSong = createFakeSong();
      const updateSpy = jest.spyOn(Songs, "findByIdAndUpdate").mockResolvedValue(fakeSong as any);

      const result = await SongsService.updateSongById(fakeSong._id, { $set: { title: "Updated" } });

      expect(updateSpy).toHaveBeenCalledWith(fakeSong._id, { $set: { title: "Updated" } }, { new: true });
      expect(result).toEqual(fakeSong);
    });
  });

  describe("manageSongLikesById", () => {
    it("should set the user like value for a song", async () => {
      const fakeSong = createFakeSong();
      const updateSpy = jest.spyOn(Songs, "findOneAndUpdate").mockResolvedValue(fakeSong as any);

      const result = await SongsService.manageSongLikesById({ id: fakeSong._id }, "like", "user-1");

      expect(updateSpy).toHaveBeenCalledWith({ _id: fakeSong._id }, { $set: { "likes.user-1": 1 } }, { new: true });
      expect(result).toEqual(fakeSong);
    });
  });

  describe("deleteSongById", () => {
    it("should delete a song by id and return it", async () => {
      const fakeSong = createFakeSong();
      const deleteSpy = jest.spyOn(Songs, "findByIdAndDelete").mockResolvedValue(fakeSong as any);

      const result = await SongsService.deleteSongById(fakeSong._id);

      expect(deleteSpy).toHaveBeenCalledWith(fakeSong._id);
      expect(result).toEqual(fakeSong);
    });
  });

  describe("getSongById", () => {
    it("should find a song by id", async () => {
      const fakeSong = createFakeSong();
      const getSpy = jest.spyOn(Songs, "findById").mockResolvedValue(fakeSong as any);

      const result = await SongsService.getSongById(fakeSong._id);

      expect(getSpy).toHaveBeenCalledWith(fakeSong._id, {});
      expect(result).toEqual(fakeSong);
    });
  });

  describe("getOneSong", () => {
    it("should find one song using the provided filter", async () => {
      const fakeSong = createFakeSong();
      const queryChain = {
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(fakeSong as never)
      };
      const findOneSpy = jest.spyOn(Songs, "findOne").mockReturnValue(queryChain as any);

      const result = await SongsService.getOneSong({ title: "Test Song" });

      expect(findOneSpy).toHaveBeenCalledWith({ title: "Test Song" });
      expect(result).toEqual(fakeSong);
    });
  });

  describe("updateSongUsesById", () => {
    it("should increment the use counters for a song", async () => {
      const fakeSong = createFakeSong();
      const updateSpy = jest.spyOn(Songs, "findByIdAndUpdate").mockResolvedValue(fakeSong as any);

      const result = await SongsService.updateSongUsesById(fakeSong._id, "botUses");

      expect(updateSpy).toHaveBeenCalledWith(
        fakeSong._id,
        { $inc: { botUses: 1, songRequestUses: 0, uses: 1 } },
        { new: true }
      );
      expect(result).toEqual(fakeSong);
    });
  });
});
