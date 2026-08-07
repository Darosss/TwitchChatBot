/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@models", () => ({
  User: {
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findOneAndUpdate: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn()
  }
}));

import { User, UserModel, UserCreateData } from "@models";
import * as UsersService from "./users";

const createFakeUser = (): UserModel => ({
  _id: "user-1",
  username: "tester",
  twitchName: "testerTwitch",
  follower: new Date("2024-01-01T00:00:00.000Z"),
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  twitchId: createFakeTwitch()._id,
  privileges: 8,
  points: 200,
  watchTime: 120,
  lastSeen: new Date("2024-01-01T00:00:00.000Z"),
  messageCount: 300
});

const createFakeTwitch = () => ({ _id: "twitch-1" });

describe("Users Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getUsers", () => {
    it("should query users with pagination and populate displayBadges when requested", async () => {
      const fakeUsers = [createFakeUser()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(fakeUsers as never)
      };

      const findSpy = jest.spyOn(User, "find").mockReturnValue(queryChain as any);

      const result = await UsersService.getUsers(
        {},
        { limit: 2, skip: 2, sort: { username: 1 }, select: { __v: 0 }, populate: { displayBadges: true } }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.sort).toHaveBeenCalledWith({ username: 1 });
      expect(queryChain.populate).toHaveBeenCalledWith([{ path: "displayBadges" }]);
      expect(result).toEqual(fakeUsers);
    });
  });

  describe("getOneUser", () => {
    it("should find a single user with optional populate data", async () => {
      const fakeUser = createFakeUser();
      const queryChain = {
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(fakeUser as never)
      };

      const findOneSpy = jest.spyOn(User, "findOne").mockReturnValue(queryChain as any);

      const result = await UsersService.getOneUser({}, { select: { __v: 0 }, populate: { displayBadges: true } });

      expect(findOneSpy).toHaveBeenCalledWith({});
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.populate).toHaveBeenCalledWith([{ path: "displayBadges" }]);
      expect(result).toEqual(fakeUser);
    });
  });

  describe("getUserById", () => {
    it("should find a user by id", async () => {
      const fakeUser = createFakeUser();
      const queryChain = {
        select: jest.fn().mockResolvedValue(fakeUser as never)
      };

      const findByIdSpy = jest.spyOn(User, "findById").mockReturnValue(queryChain as any);

      const result = await UsersService.getUserById("user-1", { select: { __v: 0 } });

      expect(findByIdSpy).toHaveBeenCalledWith("user-1");
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(result).toEqual(fakeUser);
    });
  });

  describe("updateUserById", () => {
    it("should update a user by id", async () => {
      const fakeUser = createFakeUser();
      const updateSpy = jest.spyOn(User, "findByIdAndUpdate").mockResolvedValue(fakeUser as any);

      const result = await UsersService.updateUserById("user-1", { $set: { username: "updated" } });

      expect(updateSpy).toHaveBeenCalledWith("user-1", { $set: { username: "updated" } }, { new: true });
      expect(result).toEqual(fakeUser);
    });
  });

  describe("getUserCount", () => {
    it("should return the count of users for a filter", async () => {
      const countSpy = jest.spyOn(User, "countDocuments").mockResolvedValue(4 as any);

      const result = await UsersService.getUserCount({ username: "tester" });

      expect(countSpy).toHaveBeenCalledWith({ username: "tester" });
      expect(result).toBe(4);
    });
  });

  describe("getUsernames", () => {
    it("should return usernames and total count", async () => {
      const fakeUsers = [createFakeUser()];
      const queryChain = {
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(fakeUsers as never)
      };

      const findSpy = jest.spyOn(User, "find").mockReturnValue(queryChain as any);
      const countSpy = jest.spyOn(User, "countDocuments").mockResolvedValue(1 as any);

      const result = await UsersService.getUsernames(5, 2);

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.select).toHaveBeenCalledWith("username");
      expect(queryChain.limit).toHaveBeenCalledWith(5);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(countSpy).toHaveBeenCalledWith();
      expect(result).toEqual({ usernames: fakeUsers.map((u) => u.username), total: 1 });
    });
  });

  describe("getTwitchNames", () => {
    it("should return twitch names and total count", async () => {
      const fakeUsers = [createFakeUser()];
      const queryChain = {
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(fakeUsers as never)
      };

      const findSpy = jest.spyOn(User, "find").mockReturnValue(queryChain as any);
      const countSpy = jest.spyOn(User, "countDocuments").mockResolvedValue(1 as any);

      const result = await UsersService.getTwitchNames(3, 1);

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.select).toHaveBeenCalledWith("twitchName");
      expect(queryChain.limit).toHaveBeenCalledWith(3);
      expect(queryChain.skip).toHaveBeenCalledWith(1);
      expect(countSpy).toHaveBeenCalledWith();
      expect(result).toEqual({ twitchNames: ["testerTwitch"], total: 1 });
    });
  });

  describe("isUserInDB", () => {
    it("should return a lean user if found", async () => {
      const fakeUser = createFakeUser();
      const queryChain = {
        lean: jest.fn().mockResolvedValue(fakeUser as never)
      };

      const findOneSpy = jest.spyOn(User, "findOne").mockReturnValue(queryChain as any);

      const result = await UsersService.isUserInDB({ username: fakeUser.username });

      expect(findOneSpy).toHaveBeenCalledWith({ username: fakeUser.username });
      expect(result).toEqual(fakeUser);
    });
  });

  describe("createUser", () => {
    it("should create a user", async () => {
      const fakeUser = createFakeUser();
      const createSpy = jest.spyOn(User, "create").mockResolvedValue(fakeUser as any);
      const createData: UserCreateData = {
        twitchId: fakeUser.twitchId,
        username: fakeUser.username
      };
      const result = await UsersService.createUser(createData);

      expect(createSpy).toHaveBeenCalledWith(createData);
      expect(result).toEqual(fakeUser);
    });
  });

  describe("createUserIfNotExist", () => {
    it("should upsert a user when requested", async () => {
      const fakeUser = createFakeUser();
      const queryChain = {
        lean: jest.fn().mockResolvedValue(fakeUser as never)
      };

      const findOneAndUpdateSpy = jest.spyOn(User, "findOneAndUpdate").mockReturnValue(queryChain as any);
      const createData: UserCreateData = {
        twitchId: fakeUser.twitchId,
        username: fakeUser.username
      };
      const result = await UsersService.createUserIfNotExist({ username: createData.username }, createData, true);

      expect(findOneAndUpdateSpy).toHaveBeenCalledWith({ username: createData.username }, createData, {
        upsert: true,
        new: true,
        populate: "displayBadges"
      });
      expect(result).toEqual(fakeUser);
    });
  });

  describe("updateUser", () => {
    it("should update a user by filter", async () => {
      const fakeUser = createFakeUser();
      const updateSpy = jest.spyOn(User, "findOneAndUpdate").mockResolvedValue(fakeUser as any);

      const result = await UsersService.updateUser({ username: fakeUser.username }, { $set: { username: "updated" } });

      expect(updateSpy).toHaveBeenCalledWith(
        { username: fakeUser.username },
        { $set: { username: "updated" } },
        { new: true }
      );
      expect(result).toEqual(fakeUser);
    });
  });

  describe("getFollowersCount", () => {
    it("should count followers in a date range", async () => {
      const countSpy = jest.spyOn(User, "countDocuments").mockResolvedValue(2 as any);

      const result = await UsersService.getFollowersCount(
        new Date("2024-01-01T00:00:00.000Z"),
        new Date("2024-02-01T00:00:00.000Z")
      );

      expect(countSpy).toHaveBeenCalledWith({ follower: { $gte: expect.any(Date), $lt: expect.any(Date) } });
      expect(result).toBe(2);
    });
  });
});
