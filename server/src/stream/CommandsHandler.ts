import { AudioPlayerOptions } from "@libs/types";
import { CommandsConfigs, UserModel } from "@models/types";
import {
  getChatCommands,
  getChatCommandsAliases,
  getOneChatCommand,
  updateChatCommandById,
} from "@services/chatCommands";
import { commandLogger } from "@utils/loggerUtil";
import { randomWithMax } from "@utils/randomNumbersUtil";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@libs/types";
import { Server } from "socket.io";
import MusicStreamHandler from "./MusicStreamHandler";

const musicStreamDefaultsAliases: Map<AudioPlayerOptions, number> = new Map([
  ["next", 7],
  ["skip", 7],
  ["pause", 7],
  ["resume", 7],
  ["stop", 7],
  ["play", 7],
  ["previous", 7],
  ["when", 7],
  ["sr", 0],
]);

class CommandsHandler {
  private commandsAliases: string[] = [];
  private defaultsMusicAliases: Map<AudioPlayerOptions, number> =
    musicStreamDefaultsAliases;
  private configs: CommandsConfigs;
  private readonly musicHandler: MusicStreamHandler;
  private readonly socketIO: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;
  constructor(
    socketIO: Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >,
    musicHandler: MusicStreamHandler,
    configs: CommandsConfigs
  ) {
    this.configs = configs;
    this.socketIO = socketIO;
    this.musicHandler = musicHandler;
    this.init();
  }

  private async init() {
    await this.refreshCommands();
  }

  async refreshCommands() {
    this.commandsAliases = (await getChatCommandsAliases(true)) || [];
    commandLogger.debug(`Commands words [${this.commandsAliases}]`);
  }

  async refreshConfigs(configs: CommandsConfigs) {
    this.configs = configs;
  }

  public async checkMessageForCommand(user: UserModel, message: string) {
    const isCommand = this.messageStartsWithPrefix(message);
    if (!isCommand) return;

    const answers = await Promise.all([
      this.checkMessageForDefaultMusicCommand(user, message),
      this.checkMessageForCustomCommand(user, message),
    ]);

    const [musicCmdAnswer, customCmdAnswer] = answers;

    if (musicCmdAnswer !== undefined) return musicCmdAnswer;
    else if (customCmdAnswer) return customCmdAnswer;
  }

  private async checkMessageForCustomCommand(user: UserModel, message: string) {
    const commandAlias = this.commandsAliases.find((alias) =>
      message.toLowerCase().includes(alias)
    );
    if (!commandAlias) return await this.notFoundCommand();

    return await this.findAndCheckCommandByAlias(user, commandAlias);
  }

  private async checkMessageForDefaultMusicCommand(
    user: UserModel,
    message: string
  ) {
    const defaultMusicAlias = [...this.defaultsMusicAliases.keys()].find(
      (alias: string) => message.toLowerCase().includes(alias)
    );
    if (defaultMusicAlias) {
      return this.onMessageMusicCommand(
        defaultMusicAlias,
        user.privileges,
        user.username,
        message
      );
    }
  }

  private async onMessageMusicCommand(
    musicCommand: AudioPlayerOptions,
    privilege: number,
    username: string,
    message: string
  ) {
    const commandPrivilege = this.defaultsMusicAliases.get(musicCommand);
    if (commandPrivilege && commandPrivilege > privilege) {
      console.log(commandPrivilege, privilege);
      commandLogger.info(
        `Music command: ${musicCommand} - was invoked, but privilege does not match`
      );
      return "You have no permission to do that! SabaPing";
    }
    commandLogger.info(
      `Music command: ${musicCommand} - was invoked and executed`
    );
    switch (musicCommand) {
      case "play":
        this.musicHandler.resumePlayer(true);
        return "";
      case "stop":
        return "Stop player! (Not implemented yet)";
        return "";
      case "resume":
        this.musicHandler.resumePlayer(true);
        return "";
      case "pause":
        this.musicHandler.pausePlayer(true);
        return "";
      case "skip":
        this.musicHandler.nextSong(true);
        return "";
      case "next":
        this.musicHandler.sayNextSong();
        return "";
      case "previous":
        this.musicHandler.sayPreviousSong();
        return "";
      case "when":
        this.musicHandler.sayWhenUserRequestedSong(username);
        return "";

      case "sr":
        const srCommand = `${this.configs.commandsPrefix}sr`;
        const songName = message.replace(srCommand, "").trim();

        await this.musicHandler.requestSong(username, songName, true);
        return "";
    }
  }

  private messageStartsWithPrefix(message: string) {
    if (message.startsWith(this.configs.commandsPrefix)) return true;
  }

  async findAndCheckCommandByAlias(user: UserModel, alias: string) {
    const foundCommand = await this.getCommandByAlias(alias);
    if (!foundCommand) return;

    if (this.canUserUseCommand(user.privileges, foundCommand.privilege)) {
      commandLogger.info(
        `${user.username} - used (${foundCommand.name}) command with (${alias}) alias`
      );
      return this.formatCommandMessage(
        user,
        foundCommand.messages[randomWithMax(foundCommand.messages.length)]
      );
    }
  }

  canUserUseCommand(userPrivilege: number, commandPrivilege: number) {
    if (userPrivilege >= commandPrivilege) return true;

    return false;
  }

  async getCommandByAlias(alias: string) {
    const foundCommand = await getOneChatCommand({
      aliases: { $all: alias },
    });

    return foundCommand;
  }

  async updateUsesCommand(id: string) {
    const updatedCommand = await updateChatCommandById(id, {
      $inc: { uses: 1 },
    });
  }

  formatCommandMessage(user: UserModel, message?: string) {
    let formatMsg = message || "";

    let matches = formatMsg.match(/\$\{(.*?)\}/);

    while (matches !== null) {
      const userDetail = this.formatUserDetail(
        user[matches[1] as keyof UserModel]
      );
      formatMsg = formatMsg.replace(matches[0], userDetail);

      matches = formatMsg.match(/\$\{(.*?)\}/);
    }

    return formatMsg;
  }

  formatUserDetail(detail: any) {
    if (typeof detail === "number") return Math.round(detail);
    else if (detail instanceof Date) return detail.toLocaleString();

    return detail;
  }

  async notFoundCommand() {
    //Hard codded
    let notFoundCommandMessage = "Not found command. Most used commands are:";

    const mostUsedCommands = await getChatCommands(
      {},
      { limit: 3, sort: { useCount: -1 }, select: { aliases: 1 } }
    );

    mostUsedCommands.forEach((command) => {
      notFoundCommandMessage += ` ${this.configs.commandsPrefix}${command.aliases[0]} `;
    });

    [...this.defaultsMusicAliases.keys()].forEach((defaultMusicCmd) => {
      notFoundCommandMessage += ` ${this.configs.commandsPrefix}${defaultMusicCmd}`;
    });

    return notFoundCommandMessage;
  }
}

export default CommandsHandler;
