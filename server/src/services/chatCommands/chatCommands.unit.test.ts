/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@models", () => ({
  ChatCommand: {
    find: jest.fn(),
    findOne: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    aggregate: jest.fn()
  }
}));

jest.mock("../aggregations", () => ({
  modesPipeline: [{ $match: { mode: "enabled" } }]
}));

import { ChatCommand, ChatCommandModel, ChatCommandCreateData } from "@models";
import * as ChatCommandsService from "./chatCommands";

const createFakeChatCommand = (): ChatCommandModel & { tag: string; mood: string } => ({
  _id: "command-1",
  aliases: ["hello"],
  enabled: true,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  name: "command-name",
  uses: 1,
  messages: ["command message", "command message 2"],
  tag: createFakeTag()._id,
  mood: createFakeMood()._id,
  privilege: 0
});

const createFakeTag = () => ({ _id: "tag-1" as any });
const createFakeMood = () => ({ _id: "mood-1" as any });

describe("Chat Commands Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getChatCommands", () => {
    it("should query chat commands with pagination and populate options", async () => {
      const fakeCommands = [createFakeChatCommand()];
      const queryChain = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakeCommands as never)
      };

      const findSpy = jest.spyOn(ChatCommand, "find").mockReturnValue(queryChain as any);

      const result = await ChatCommandsService.getChatCommands(
        {},
        { limit: 2, skip: 2, sort: { createdAt: -1 }, select: { __v: 0 }, populate: ["user"] }
      );

      expect(findSpy).toHaveBeenCalledWith({});
      expect(queryChain.limit).toHaveBeenCalledWith(2);
      expect(queryChain.skip).toHaveBeenCalledWith(2);
      expect(queryChain.select).toHaveBeenCalledWith({ __v: 0 });
      expect(queryChain.populate).toHaveBeenCalledWith(["user"]);
      expect(queryChain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(fakeCommands);
    });
  });

  describe("getAllChatCommands", () => {
    it("should return all chat commands", async () => {
      const fakeCommands = [createFakeChatCommand()];
      const findSpy = jest.spyOn(ChatCommand, "find").mockResolvedValue(fakeCommands as any);

      const result = await ChatCommandsService.getAllChatCommands();

      expect(findSpy).toHaveBeenCalledWith({});
      expect(result).toEqual(fakeCommands);
    });
  });

  describe("getOneChatCommand", () => {
    it("should return the matching command by filter", async () => {
      const fakeCommand = createFakeChatCommand();
      const findOneSpy = jest.spyOn(ChatCommand, "findOne").mockResolvedValue(fakeCommand as any);

      const result = await ChatCommandsService.getOneChatCommand({ aliases: "hello" });

      expect(findOneSpy).toHaveBeenCalledWith({ aliases: "hello" });
      expect(result).toBe(fakeCommand);
    });
  });

  describe("getChatCommandsCount", () => {
    it("should return the count of chat commands for a filter", async () => {
      const countSpy = jest.spyOn(ChatCommand, "countDocuments").mockResolvedValue(6 as any);

      const result = await ChatCommandsService.getChatCommandsCount({ enabled: true });

      expect(countSpy).toHaveBeenCalledWith({ enabled: true });
      expect(result).toBe(6);
    });
  });

  describe("createChatCommand", () => {
    it("should create a chat command and return it", async () => {
      const fakeCommand = createFakeChatCommand();
      const createSpy = jest.spyOn(ChatCommand, "create").mockResolvedValue(fakeCommand as any);
      const createData: ChatCommandCreateData = {
        aliases: fakeCommand.aliases,
        enabled: fakeCommand.enabled,
        name: fakeCommand.name,
        messages: fakeCommand.messages,
        tag: fakeCommand.tag,
        mood: fakeCommand.mood
      };

      const result = await ChatCommandsService.createChatCommand(createData);

      expect(createSpy).toHaveBeenCalledWith(createData);
      expect(result).toBe(fakeCommand);
    });
  });

  describe("getChatCommandById", () => {
    it("should return a chat command when it exists", async () => {
      const fakeCommand = createFakeChatCommand();
      const selectMock = jest.fn().mockResolvedValue(fakeCommand as never);
      const findByIdSpy = jest.spyOn(ChatCommand, "findById").mockReturnValue({ select: selectMock } as any);

      const result = await ChatCommandsService.getChatCommandById(fakeCommand._id, { select: { __v: 0 } });

      expect(findByIdSpy).toHaveBeenCalledWith(fakeCommand._id);
      expect(selectMock).toHaveBeenCalledWith({ __v: 0 });
      expect(result).toBe(fakeCommand);
    });
  });

  describe("updateChatCommandById", () => {
    it("should update a chat command and return it", async () => {
      const fakeCommand = createFakeChatCommand();
      const updateSpy = jest.spyOn(ChatCommand, "findByIdAndUpdate").mockResolvedValue(fakeCommand as any);

      const result = await ChatCommandsService.updateChatCommandById(fakeCommand._id, { enabled: false });

      expect(updateSpy).toHaveBeenCalledWith(fakeCommand._id, { enabled: false }, { new: true });
      expect(result).toBe(fakeCommand);
    });
  });

  describe("updateChatCommands", () => {
    it("should update the matching chat command and return it", async () => {
      const fakeCommand = createFakeChatCommand();
      const updateSpy = jest.spyOn(ChatCommand, "findOneAndUpdate").mockResolvedValue(fakeCommand as any);

      const result = await ChatCommandsService.updateChatCommands({ aliases: "hello" }, { enabled: false });

      expect(updateSpy).toHaveBeenCalledWith({ aliases: "hello" }, { enabled: false }, { new: true });
      expect(result).toBe(fakeCommand);
    });
  });

  describe("deleteChatCommandById", () => {
    it("should delete a chat command and return it", async () => {
      const fakeCommand = createFakeChatCommand();
      const deleteSpy = jest.spyOn(ChatCommand, "findByIdAndDelete").mockResolvedValue(fakeCommand as any);

      const result = await ChatCommandsService.deleteChatCommandById(fakeCommand._id);

      expect(deleteSpy).toHaveBeenCalledWith(fakeCommand._id);
      expect(result).toBe(fakeCommand);
    });
  });

  describe("getChatCommandsAliases", () => {
    it("should aggregate aliases and return them", async () => {
      const aggregateSpy = jest
        .spyOn(ChatCommand, "aggregate")
        .mockResolvedValue([{ aliases: ["hello", "hi"] }] as any);

      const result = await ChatCommandsService.getChatCommandsAliases(false);

      expect(aggregateSpy).toHaveBeenCalled();
      expect(result).toEqual(["hello", "hi"]);
    });
  });
});
