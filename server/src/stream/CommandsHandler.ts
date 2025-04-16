import { ChatCommandModel, ConfigModel, UserModel } from "@models";
import { ManageSongLikesAction, getChatCommandsAliases, getOneChatCommand, updateChatCommandById } from "@services";
import { commandLogger, randomWithMax } from "@utils";
import { MusicPlayerCommands } from "./types";
import AchievementsHandler from "./AchievementsHandler";
import MusicHeadHandler from "./music/MusicHeadHandler";
import { ConfigManager } from "./ConfigManager";
import { SocketHandler } from "@socket";

class CommandsHandler {
  private configs: ConfigModel = ConfigManager.getInstance().getConfig();
  private commandsAliases: string[] = [];
  private defaultsMusicAliases = new Map<MusicPlayerCommands, number>();
  private musicHandler: MusicHeadHandler = MusicHeadHandler.getInstance();

  constructor() {
    ConfigManager.getInstance().registerObserver(this.handleConfigUpdate.bind(this));
    const socketHandler = SocketHandler.getInstance();
    socketHandler.subscribe("refreshCommands", this.refreshCommands.bind(this));
    socketHandler.subscribe("changeModes", this.refreshCommands.bind(this));

    this.prepareMusicDefaultAliases();
    this.init();
  }

  private async init() {
    await this.refreshCommands();
  }

  private async handleConfigUpdate(newConfig: ConfigModel) {
    this.configs = newConfig;
    this.commandsAliases = (await getChatCommandsAliases(true)) || [];
    commandLogger.debug(`Commands words [${this.commandsAliases}]`);
  }

  public async refreshCommands() {
    this.commandsAliases = (await getChatCommandsAliases(true)) || [];
    commandLogger.debug(`Commands words [${this.commandsAliases}]`);
  }

  private prepareMusicDefaultAliases() {
    const permissions = this.configs.headConfigs.permissionLevels;
    const modPermission = permissions.mod;
    const allPermission = permissions.all;
    this.defaultsMusicAliases = new Map([
      ["skip", modPermission],
      ["pause", modPermission],
      ["resume", modPermission],
      ["stop", modPermission],
      ["play", modPermission],
      ["load", modPermission],
      ["volume", modPermission],
      ["next", allPermission],
      ["previous", allPermission],
      ["when", allPermission],
      ["sr", allPermission],
      ["like", allPermission],
      ["dislike", allPermission],
      ["unlike", allPermission]
    ]);
  }

  public async checkMessageForCommand(user: UserModel, message: string) {
    const isCommand = this.messageStartsWithPrefix(message);
    if (!isCommand) return false;

    await AchievementsHandler.getInstance().incrementCommandAchievements({
      userId: user._id,
      username: user.username
    });

    const answers = await Promise.all([
      this.checkMessageForDefaultMusicCommand(user, message),
      this.checkMessageForCustomCommand(user, message)
    ]);

    const [musicCmdAnswer, customCmdAnswer] = answers;

    if (musicCmdAnswer !== undefined) return musicCmdAnswer;
    else if (customCmdAnswer) return customCmdAnswer;
  }

  private async checkMessageForCustomCommand(user: UserModel, message: string) {
    const commandAlias = this.commandsAliases.find((alias) => message.toLowerCase().includes(alias));
    if (!commandAlias) return commandLogger.info("Not found command");

    return await this.findAndCheckCommandByAlias(user, commandAlias);
  }

  private async checkMessageForDefaultMusicCommand(user: UserModel, message: string) {
    const defaultMusicAlias = [...this.defaultsMusicAliases.keys()].find((alias: string) =>
      message.toLowerCase().startsWith(this.configs.commandsConfigs.commandsPrefix + alias)
    );
    if (defaultMusicAlias) {
      return this.onMessageMusicCommand(defaultMusicAlias, user.privileges, user.username, user._id, message);
    }
  }

  private async onMessageMusicCommand(
    musicCommand: MusicPlayerCommands,
    privilege: number,
    username: string,
    userId: string,
    message: string
  ) {
    const commandPrivilege = this.defaultsMusicAliases.get(musicCommand);

    if (commandPrivilege && commandPrivilege > privilege) {
      commandLogger.info(`Music command: ${musicCommand} - was invoked, but privilege does not match`);
      return "You have no permission to do that! SabaPing";
    }
    commandLogger.info(`Music command: ${musicCommand} - was invoked and executed`);
    switch (musicCommand) {
      case "play":
        this.musicHandler.resumePlayer();
        return true;
      case "stop":
        return "Stop player! (Not implemented yet)";
      case "resume":
        this.musicHandler.resumePlayer();
        return true;
      case "pause":
        this.musicHandler.pausePlayer();
        return true;
      case "skip":
        this.musicHandler.nextSong();
        return true;
      case "next":
        this.musicHandler.sayNextSong();
        return true;
      case "previous":
        this.musicHandler.sayPreviousSong();
        return true;
      case "when":
        this.musicHandler.sayWhenUserRequestedSong(username);
        return true;
      case "load":
        const loadCommand = `${this.configs.commandsConfigs.commandsPrefix}load`;
        const loadOpt = message.replace(loadCommand, "").trim();
        return await this.musicHandler.loadNewSongs("yt", loadOpt, true);
      case "sr":
        const srCommand = `${this.configs.commandsConfigs.commandsPrefix}sr`;
        const songName = message.replace(srCommand, "").trim();

        return await this.musicHandler.requestSongByCommand({ username, songName });
      case "volume":
        const volumeCommand = `${this.configs.commandsConfigs.commandsPrefix}volume`;
        const volume = Number(message.replace(volumeCommand, "").trim());

        this.musicHandler.changeVolume(volume);
        return true;

      case "like":
      case "dislike":
      case "unlike":
        await AchievementsHandler.getInstance().incrementMusicLikesCommandAchievements({
          userId,
          username
        });
        await this.musicHandler.manageSongLikesByUser(username, musicCommand as ManageSongLikesAction);
        return true;
    }
  }

  private messageStartsWithPrefix(message: string) {
    if (message.startsWith(this.configs.commandsConfigs.commandsPrefix)) return true;
  }

  private async findAndCheckCommandByAlias(user: UserModel, alias: string) {
    const foundCommand = await this.getCommandByAlias(alias);
    if (!foundCommand) return "Something went wrong. Try again later.";

    if (this.canUserUseCommand(user.privileges, foundCommand.privilege)) {
      commandLogger.info(`${user.username} - used (${foundCommand.name}) command with (${alias}) alias`);
      let randomCommandMsg = foundCommand.messages[randomWithMax(foundCommand.messages.length)];

      randomCommandMsg = this.formatCommandMessageCommandData(foundCommand, randomCommandMsg);

      randomCommandMsg = this.formatCommandMessageUserData(user, randomCommandMsg);

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
      aliases: { $elemMatch: { $regex: alias, $options: "i" } }
    });

    return foundCommand;
  }

  private async updateUsesCommand(id: string) {
    const updatedCommand = await updateChatCommandById(id, {
      $inc: { uses: 1 }
    });
    return updatedCommand;
  }

  private formatCommandMessageUserData(user: UserModel, message?: string) {
    let formatMsg = message || "";
    const regExp = /\$user\{(.*?)\}/;

    let matches = formatMsg.match(regExp);

    while (matches !== null) {
      const userDetail = this.formatModelDetail(user[matches[1] as keyof UserModel]);
      formatMsg = formatMsg.replace(matches[0], userDetail);

      matches = formatMsg.match(regExp);
    }

    return formatMsg;
  }

  private formatCommandMessageCommandData(chatCommand: ChatCommandModel, message?: string) {
    let formatMsg = message || "";
    const regExp = /\$command\{(.*?)\}/;

    let matches = formatMsg.match(regExp);

    while (matches !== null) {
      const commandDetail = this.formatModelDetail(chatCommand[matches[1] as keyof ChatCommandModel]);

      formatMsg = formatMsg.replace(matches[0], commandDetail);

      matches = formatMsg.match(regExp);
    }

    return formatMsg;
  }

  private formatModelDetail(detail: unknown): string {
    //FIXME: ++1 detail for uses, it doesnt change a thing for points or messages so just for now.
    if (typeof detail === "number") return String(Math.round(++detail));
    else if (detail instanceof Date) return detail.toLocaleString();

    return String(detail);
  }
}

export default CommandsHandler;
