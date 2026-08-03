/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@models", () => ({
  AuthToken: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn()
  }
}));

import { AuthToken } from "@models";
import * as AuthService from "./auth";

const createFakeAuth = () => ({
  _id: "auth-1",
  accessToken: "access-token",
  refreshToken: "refresh-token",
  expiresIn: 3600,
  obtainmentTimestamp: 1234567890,
  scope: ["chat:read"],
  userId: "user-1",
  authTag: Buffer.from("tag"),
  ivAccessToken: Buffer.from("iv"),
  authTagRefreshToken: Buffer.from("tag2"),
  ivRefreshToken: Buffer.from("iv2")
});

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getAuthToken", () => {
    it("should return the auth token document when one exists", async () => {
      const fakeAuth = createFakeAuth();
      const findOneSpy = jest.spyOn(AuthToken, "findOne").mockResolvedValue(fakeAuth as any);

      const result = await AuthService.getAuthToken();

      expect(findOneSpy).toHaveBeenCalledWith({});
      expect(result).toBe(fakeAuth);
    });
  });

  describe("createNewAuth", () => {
    it("should create a new auth document and return it", async () => {
      const fakeAuth = createFakeAuth();
      const createSpy = jest.spyOn(AuthToken, "create").mockResolvedValue(fakeAuth as any);
      const createData = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        expiresIn: 3600,
        obtainmentTimestamp: 1234567890,
        scope: ["chat:read"],
        userId: "user-1"
      };

      const result = await AuthService.createNewAuth(createData);

      expect(createSpy).toHaveBeenCalledWith(createData);
      expect(result).toBe(fakeAuth);
    });
  });

  describe("updateAuthUserId", () => {
    it("should update the user id on the auth token", async () => {
      const fakeAuth = createFakeAuth();
      const updateSpy = jest.spyOn(AuthToken, "findByIdAndUpdate").mockResolvedValue(fakeAuth as any);

      const result = await AuthService.updateAuthUserId("auth-1", "user-2");

      expect(updateSpy).toHaveBeenCalledWith("auth-1", { userId: "user-2" }, { new: true });
      expect(result).toBe(fakeAuth);
    });
  });

  describe("removeAuthToken", () => {
    it("should remove and return the auth token when one exists", async () => {
      const fakeAuth = createFakeAuth();
      const deleteSpy = jest.spyOn(AuthToken, "findOneAndDelete").mockResolvedValue(fakeAuth as any);

      const result = await AuthService.removeAuthToken();

      expect(deleteSpy).toHaveBeenCalledWith();
      expect(result).toBe(fakeAuth);
    });

    it("should throw when no auth token exists", async () => {
      jest.spyOn(AuthToken, "findOneAndDelete").mockResolvedValue(null as any);

      await expect(AuthService.removeAuthToken()).rejects.toThrow();
    });
  });
});
