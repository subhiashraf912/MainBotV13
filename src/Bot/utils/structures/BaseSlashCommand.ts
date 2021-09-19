import { ChatInputApplicationCommandData, Interaction } from "discord.js";
import DiscordClient from "../../client/client";
export default abstract class BaseSlashCommand {
  constructor(private options: ChatInputApplicationCommandData) {}

  getName(): string {
    return this.options.name;
  }
  getDescription(): string {
    return this.options.description || "No description for this command!";
  }
  getOptions() {
    return this.options.options;
  }

  abstract run(
    client: DiscordClient,
    message: Interaction,
    args: Array<string> | null
  ): Promise<void>;
}
