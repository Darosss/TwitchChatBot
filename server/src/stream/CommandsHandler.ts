import HeadHandler from "./HeadHandler";
import { ApiClient, HelixPrivilegedUser } from "@twurple/api";
import { AudioPlayerOptions } from "@libs/types";
import {
  ChatCommandModel,
  CommandsConfigs,
  HeadConfigs,
  UserModel,
} from "@models/types";
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

type CommandsHandlerConfigs = CommandsConfigs &
  Pick<HeadConfigs, "permissionLevels">;

class CommandsHandler extends HeadHandler {
  private commandsAliases: string[] = [];
  private defaultsMusicAliases = new Map<AudioPlayerOptions, number>();
  private musicCommandsPermission: number;
  private musicCommandCommonPermission: number;
  private configs: CommandsHandlerConfigs;
  private readonly musicHandler: MusicStreamHandler;

  constructor(
    twitchApi: ApiClient,
    socketIO: Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >,
    authorizedUser: HelixPrivilegedUser,
    musicHandler: MusicStreamHandler,
    configs: CommandsHandlerConfigs
  ) {
    super(socketIO, twitchApi, authorizedUser);
    this.configs = configs;
    this.musicHandler = musicHandler;
    this.musicCommandsPermission = this.configs.permissionLevels.mod;
    this.musicCommandCommonPermission = this.configs.permissionLevels.all;
    this.prepareMusicDefaultAliases();
    this.init();
  }

  private async init() {
    await this.refreshCommands();
  }

  public async refreshCommands() {
    this.commandsAliases = (await getChatCommandsAliases(true)) || [];
    commandLogger.debug(`Commands words [${this.commandsAliases}]`);
  }

  public async refreshConfigs(configs: CommandsHandlerConfigs) {
    this.configs = configs;
    this.musicCommandsPermission = this.configs.permissionLevels.mod;
    this.musicCommandCommonPermission = this.configs.permissionLevels.all;
    this.prepareMusicDefaultAliases();
  }

  private prepareMusicDefaultAliases() {
    this.defaultsMusicAliases = new Map([
      ["skip", this.musicCommandsPermission],
      ["pause", this.musicCommandsPermission],
      ["resume", this.musicCommandsPermission],
      ["stop", this.musicCommandsPermission],
      ["play", this.musicCommandsPermission],
      ["load", this.musicCommandsPermission],
      ["volume", this.musicCommandsPermission],
      ["next", this.musicCommandCommonPermission],
      ["previous", this.musicCommandCommonPermission],
      ["when", this.musicCommandCommonPermission],
      ["sr", this.musicCommandCommonPermission],
    ]);
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
    console.log(
      commandPrivilege && commandPrivilege > privilege,
      "xD",
      commandPrivilege,
      privilege
    );
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
      case "load":
        const loadCommand = `${this.configs.commandsPrefix}load`;
        const loadOpt = message.replace(loadCommand, "").trim();
        this.musicHandler.loadNewSongs(loadOpt, true, true);
        return "";
      case "sr":
        const srCommand = `${this.configs.commandsPrefix}sr`;
        const songName = message.replace(srCommand, "").trim();

        await this.musicHandler.requestSong(username, songName, true);
        return "";
      case "volume":
        const volumeCommand = `${this.configs.commandsPrefix}volume`;
        const volume = Number(message.replace(volumeCommand, "").trim());

        this.musicHandler.changeVolume(volume, true);
        return "";
    }
  }

  private messageStartsWithPrefix(message: string) {
    if (message.startsWith(this.configs.commandsPrefix)) return true;
  }

  private async findAndCheckCommandByAlias(user: UserModel, alias: string) {
    const foundCommand = await this.getCommandByAlias(alias);
    if (!foundCommand) return;

    if (this.canUserUseCommand(user.privileges, foundCommand.privilege)) {
      commandLogger.info(
        `${user.username} - used (${foundCommand.name}) command with (${alias}) alias`
      );
      let randomCommandMsg =
        foundCommand.messages[randomWithMax(foundCommand.messages.length)];

      randomCommandMsg = this.formatCommandMessageCommandData(
        foundCommand,
        randomCommandMsg
      );

      randomCommandMsg = this.formatCommandMessageUserData(
        user,
        randomCommandMsg
      );

      this.updateUsesCommand(foundCommand.id);

      return randomCommandMsg;
    }
  }

  private canUserUseCommand(userPrivilege: number, commandPrivilege: number) {
    if (userPrivilege >= commandPrivilege) return true;

    return false;
  }

  private async getCommandByAlias(alias: string) {
    const foundCommand = await getOneChatCommand({
      aliases: { $elemMatch: { $regex: alias, $options: "i" } },
    });

    return foundCommand;
  }

  private async updateUsesCommand(id: string) {
    const updatedCommand = await updateChatCommandById(id, {
      $inc: { uses: 1 },
    });
  }

  private formatCommandMessageUserData(user: UserModel, message?: string) {
    let formatMsg = message || "";
    const regExp = /\$user\{(.*?)\}/;

    let matches = formatMsg.match(regExp);

    while (matches !== null) {
      const userDetail = this.formatModelDetail(
        user[matches[1] as keyof UserModel]
      );
      formatMsg = formatMsg.replace(matches[0], userDetail);

      matches = formatMsg.match(regExp);
    }

    return formatMsg;
  }

  private formatCommandMessageCommandData(
    chatCommand: ChatCommandModel,
    message?: string
  ) {
    let formatMsg = message || "";
    const regExp = /\$command\{(.*?)\}/;

    let matches = formatMsg.match(regExp);

    while (matches !== null) {
      const commandDetail = this.formatModelDetail(
        chatCommand[matches[1] as keyof ChatCommandModel]
      );

      formatMsg = formatMsg.replace(matches[0], commandDetail);

      matches = formatMsg.match(regExp);
    }

    return formatMsg;
  }

  private formatModelDetail(detail: any) {
    //FIXME: ++1 detail for uses, it doesnt change a thing for points or messages so just for now.
    if (typeof detail === "number") return Math.round(++detail);
    else if (detail instanceof Date) return detail.toLocaleString();

    return detail;
  }

  private async notFoundCommand() {
    //Hard codded
    let notFoundCommandMessage = "Not found command. Most used commands are:";

    const mostUsedCommands = await getChatCommands(
      {},
      { limit: 3, sort: { uses: -1 }, select: { aliases: 1 } }
    );

    mostUsedCommands.forEach((command) => {
      notFoundCommandMessage += ` ${this.configs.commandsPrefix}${command.aliases[0]} `;
    });

    [...this.defaultsMusicAliases.entries()].forEach(
      ([command, permission]) => {
        if (permission > this.musicCommandCommonPermission) return;

        notFoundCommandMessage += ` ${this.configs.commandsPrefix}${command}`;
      }
    );

    return notFoundCommandMessage;
  }
}

export default CommandsHandler;
