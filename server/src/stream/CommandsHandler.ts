import { UserModel } from "@models/types";
import {
  getChatCommands,
  getChatCommandsAliases,
  getOneChatCommand,
  updateChatCommandById,
} from "@services/chatCommands";
import { commandLogger } from "@utils/loggerUtil";
import { randomWithMax } from "@utils/randomNumbersUtil";

class CommandsHandler {
  private commandsAliases: string[] = [];
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
    this.init();
  }

  private async init() {
    await this.refreshCommands();
  }

  async refreshCommands() {
    this.commandsAliases = (await getChatCommandsAliases()) || [];
  }

  async refreshPrefix(prefix: string) {
    this.prefix = prefix;
  }

  public async checkMessageForCommand(user: UserModel, message: string) {
    if (!message.startsWith(this.prefix)) return false;

    const commandAlias = this.commandsAliases.find((alias) =>
      message.toLowerCase().includes(alias)
    );
    if (!commandAlias) return await this.notFoundCommand();

    return await this.findAndCheckCommandByAlias(user, commandAlias);
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
    if (typeof detail === "number") return detail.toLocaleString();
    else if (detail instanceof Date) return detail.toLocaleString();

    return detail;
  }

  async notFoundCommand() {
    //Hard codded
    let notFoundCommandMessage = "Not found command. Most used commands are:";

    const mostUsedCommands = await getChatCommands(
      {},
      { limit: 5, sort: { useCount: -1 }, select: { aliases: 1 } }
    );

    mostUsedCommands.forEach((command) => {
      notFoundCommandMessage += ` [${command.aliases.join(", ")}]`;
    });

    return notFoundCommandMessage;
  }
}

export default CommandsHandler;
