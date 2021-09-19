import DisTubeBaseEvent from "../utils/structures/DistubeBaseEvent";
import { Message } from "discord.js";
import DiscordClient from "../client/client";
import GetLanguage from "../utils/Languages";
import getConfig from "../utils/constants/getConfig";
export default class SearchCancelEvent extends DisTubeBaseEvent {
  constructor() {
    super("searchCancel");
  }
  async run(client: DiscordClient, message: Message) {
    const config = await getConfig(client, message.guild?.id as string);
    message.channel.send({
      content: GetLanguage("DisTubeSearchCancelEvent", config.language),
    });
  }
}
