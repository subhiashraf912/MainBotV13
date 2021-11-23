import { TextChannel } from "discord.js";
import DiscordClient from "../classes/client";
import getConfig from "../utils/constants/getConfig";
import GetLanguage from "../utils/Languages";
import DisTubeBaseEvent from "../utils/structures/DistubeBaseEvent";
export default class ErrorEvent extends DisTubeBaseEvent {
  constructor() {
    super("error");
  }
  async run(client: DiscordClient, channel: TextChannel, error: Error) {
    const config = await getConfig(client, channel.guild.id);
    channel.send({
      content: GetLanguage("DisTubeErrorEvent", config.language).replaceAll(
        "{error}",
        error.message
      ),
    });
  }
}
