import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import { PermissionString } from "discord.js";
import GetLanguage from "../Languages";
import Category from "../types/category.type";
export default abstract class BaseCommand {
	constructor(private options: commandOptions) {}

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
		args: Array<string> | null,
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
