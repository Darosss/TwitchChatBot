/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@models", () => ({
  StreamSession: {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn()
  }
}));

jest.mock("@services", () => ({
  getMostActiveUsersByMsgs: jest.fn(),
  getMostUsedWord: jest.fn(),
  getMessagesCountByDate: jest.fn(),
  getMostActiveUsersByRedemptions: jest.fn(),
  getFollowersCount: jest.fn()
}));

import { StreamSession, StreamSessionModel } from "@models";
import * as StreamSessionsService from "./streamSessions";
import {
  getMostActiveUsersByMsgs,
  getMostUsedWord,
  getMessagesCountByDate,
  getMostActiveUsersByRedemptions,
  getFollowersCount
} from "@services";

const createFakeStreamSession = (): StreamSessionModel => ({
  _id: "session-1",
  sessionStart: new Date("2024-01-01T00:00:00.000Z"),
  sessionEnd: new Date("2024-01-01T23:59:59.000Z"),
  viewers: { "viewer-1": 10, "viewer-2": 7 },
  events: [],
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  sessionTitles: {
    [`${new Date("2024-01-01T00:00:00.000Z").getTime()}`]: "Initial Title"
  },
  categories: {
    [`${new Date("2024-01-01T00:00:00.000Z").getTime()}`]: "Initial Category"
  },
  tags: {
    [`${new Date("2024-01-01T00:00:00.000Z").getTime()}`]: "Initial Tag"
  },
  watchers: { "viewer-1": 600, "viewer-2": 50 }
});

describe("Stream Sessions Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getStreamSessions", () => {
    it("should query stream sessions with pagination and return the result", async () => {
      const fakeSessions = [createFakeStreamSession()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakeSessions as never)
      };

      const findSpy = jest.spyOn(StreamSession, "find").mockReturnValue(queryChain as any);

      const result = await StreamSessionsService.getStreamSessions(
        {},
        { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 } }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeSessions);
    });
  });

  describe("getStreamSessionById", () => {
    it("should find a stream session by id and populate its events", async () => {
      const fakeSession = createFakeStreamSession();
      const queryChain = {
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(fakeSession as never)
      };

      const findByIdSpy = jest.spyOn(StreamSession, "findById").mockReturnValue(queryChain as any);

      const result = await StreamSessionsService.getStreamSessionById("session-1", { select: { __v: 0 } });

      expect(findByIdSpy).toHaveBeenCalledWith("session-1");
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.populate).toHaveBeenCalledWith("events.user");
      expect(result).toEqual(fakeSession);
    });
  });

  describe("getCurrentStreamSession", () => {
    it("should find the currently active session", async () => {
      const fakeSession = createFakeStreamSession();
      const queryChain = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(fakeSession as never)
      };

      const findOneSpy = jest.spyOn(StreamSession, "findOne").mockReturnValue(queryChain as any);

      const result = await StreamSessionsService.getCurrentStreamSession({ select: { __v: 0 } });

      expect(findOneSpy).toHaveBeenCalled();
      expect(queryChain.sort).toHaveBeenCalledWith({ sessionStart: -1 });
      expect(queryChain.limit).toHaveBeenCalledWith(1);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.populate).toHaveBeenCalledWith("events.user");
      expect(result).toEqual(fakeSession);
    });
  });

  describe("updateCurrentStreamSession", () => {
    it("should update the current stream session if one exists", async () => {
      const fakeSession = createFakeStreamSession();
      const timestamp = new Date().getTime();
      const updatedSession = { ...fakeSession, viewers: { ...fakeSession.viewers, [`${timestamp}`]: 320 } };

      jest.spyOn(StreamSessionsService, "getCurrentStreamSession").mockResolvedValue(fakeSession as any);
      const updateSpy = jest.spyOn(StreamSession, "findByIdAndUpdate").mockResolvedValue(updatedSession as any);

      const result = await StreamSessionsService.updateCurrentStreamSession({
        $set: { [`viewers.${timestamp}`]: 320 }
      });

      expect(updateSpy).toHaveBeenCalledWith("session-1", { $set: { [`viewers.${timestamp}`]: 320 } }, { new: true });
      expect(result).toEqual(updatedSession);
    });
  });

  describe("getLatestStreamSession", () => {
    it("should find the latest stream session", async () => {
      const fakeSession = createFakeStreamSession();
      const queryChain = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(fakeSession as never)
      };

      const findOneSpy = jest.spyOn(StreamSession, "findOne").mockReturnValue(queryChain as any);

      const result = await StreamSessionsService.getLatestStreamSession({ select: { __v: 0 } });

      expect(findOneSpy).toHaveBeenCalledWith({});
      expect(queryChain.sort).toHaveBeenCalledWith({ sessionStart: -1 });
      expect(queryChain.limit).toHaveBeenCalledWith(1);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.populate).toHaveBeenCalledWith("events.user");
      expect(result).toEqual(fakeSession);
    });
  });

  describe("getStreamSessionStatistics", () => {
    it("should aggregate session statistics from the related services", async () => {
      const fakeSession = createFakeStreamSession();
      jest.mocked(getMessagesCountByDate).mockResolvedValue(3 as any);
      jest
        .mocked(getMostActiveUsersByMsgs)
        .mockResolvedValue([{ _id: "user-1", username: "tester", messageCount: 2 }] as any);
      jest
        .mocked(getMostActiveUsersByRedemptions)
        .mockResolvedValue([{ _id: "user-2", username: "redeemer", redemptionsCount: 1 }] as any);
      jest.mocked(getMostUsedWord).mockResolvedValue([{ _id: "hello", count: 2 }] as any);
      jest.mocked(getFollowersCount).mockResolvedValue(4 as any);

      const result = await StreamSessionsService.getStreamSessionStatistics(fakeSession as any, {
        limitTopRedemptionsUsers: 1,
        limitMostUsedWords: 1,
        limitTopMessageUsers: 1,
        limitViewers: 2
      });

      expect(getMessagesCountByDate).toHaveBeenCalledWith(fakeSession.sessionStart, fakeSession.sessionEnd);
      expect(getMostActiveUsersByMsgs).toHaveBeenCalledWith(1, fakeSession.sessionStart, fakeSession.sessionEnd);
      expect(getMostActiveUsersByRedemptions).toHaveBeenCalledWith(1, fakeSession.sessionStart, fakeSession.sessionEnd);
      expect(getMostUsedWord).toHaveBeenCalledWith(1, fakeSession.sessionStart, fakeSession.sessionEnd);
      expect(getFollowersCount).toHaveBeenCalledWith(fakeSession.sessionStart, fakeSession.sessionEnd);
      expect(result).toEqual({
        messagesCount: 3,
        topMsgsUsers: [{ _id: "user-1", username: "tester", messageCount: 2 }],
        topRedemptionsUsers: [{ _id: "user-2", username: "redeemer", redemptionsCount: 1 }],
        topUsedWords: [{ _id: "hello", count: 2 }],
        followersCount: 4,
        viewers: { "viewer-1": 10, "viewer-2": 7 }
      });
    });
  });

  describe("getStreamSessionsCount", () => {
    it("should return the count of stream sessions for a filter", async () => {
      const countSpy = jest.spyOn(StreamSession, "countDocuments").mockResolvedValue(4 as any);

      const result = await StreamSessionsService.getStreamSessionsCount({ sessionStart: { $exists: true } });

      expect(countSpy).toHaveBeenCalledWith({ sessionStart: { $exists: true } });
      expect(result).toBe(4);
    });
  });

  describe("createStreamSession", () => {
    it("should create a new stream session", async () => {
      const fakeSession = createFakeStreamSession();
      const createSpy = jest.spyOn(StreamSession, "create").mockResolvedValue(fakeSession as any);

      const result = await StreamSessionsService.createStreamSession({
        sessionStart: new Date(),
        sessionEnd: new Date()
      } as any);

      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({ sessionStart: expect.any(Date), sessionEnd: expect.any(Date) })
      );
      expect(result).toEqual(fakeSession);
    });
  });

  describe("updateStreamSessionById", () => {
    it("should update a stream session by id", async () => {
      const fakeSession = createFakeStreamSession();
      const updateSpy = jest.spyOn(StreamSession, "findByIdAndUpdate").mockResolvedValue(fakeSession as any);

      const timestamp = new Date().getTime();
      const result = await StreamSessionsService.updateStreamSessionById("session-1", {
        $set: { [`viewers.${timestamp}`]: 320 }
      } as any);

      expect(updateSpy).toHaveBeenCalledWith(
        fakeSession._id,
        { $set: { [`viewers.${timestamp}`]: 320 } },
        { new: true }
      );
      expect(result).toEqual(fakeSession);
    });
  });
});
