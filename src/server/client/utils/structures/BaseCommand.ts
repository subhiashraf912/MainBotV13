import { Message } from "discord.js";
import DiscordClient from "../../classes/client";
import { PermissionString } from "discord.js";
import GetLanguage from "../Languages";
import Category from "../../../../types/category.type";
export default abstract class BaseCommand {
  name;
  category;
  aliases;
  userPermissions;
  botPermissions;
  description;
  usage;
  tutGif;

  constructor(private options: commandOptions) {
    this.name = options.name;
    this.category = options.category;
    this.aliases = options.aliases || [];
    this.userPermissions = options.userPermissions || [];
    this.botPermissions = options.botPermissions || [];
    this.description = GetLanguage(
      `${this.options.name}_description`,
      "english"
    );
    this.usage = GetLanguage(`${this.options.name}_usage`, "english");
    this.tutGif = options.tutorialGif || "";
  }
  getName(): string {
    return this.options.name;
  }
  getCategory(): keyof Category {
    return this.options.category;
  }
  getAliases(): Array<string> {
    return this.options.aliases || [];
  }
  getUserPermissions(): PermissionString[] {
    return this.options.userPermissions || [];
  }
  getBotPermissions(): PermissionString[] {
    return this.options.botPermissions || [];
  }
  getDescription(language: string): string {
    return (
      GetLanguage(`${this.options.name}_description`, language) ||
      (GetLanguage("no_description", language) as string)
    );
  }
  getUsage(language: string): string {
    return (
      (GetLanguage(`${this.options.name}_usage`, language) as string) ||
      (GetLanguage("NoDescription", language) as string)
    );
  }
  get tutorialGif(): string {
    return this.options.tutorialGif || "";
  }

  abstract run(
    client: DiscordClient,
    message: Message,
    args: Array<string> | null
  ): Promise<void>;
}
type commandOptions = {
  name: string;
  category: keyof Category;
  aliases?: string[];
  userPermissions?: PermissionString[];
  botPermissions?: PermissionString[];
  tutorialGif?: string;
};
