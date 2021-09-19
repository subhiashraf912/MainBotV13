import DisTubeBaseEvent from "../utils/structures/DistubeBaseEvent";
import { Message } from "discord.js";
import { SearchResult } from "distube";
import DiscordClient from "../client/client";
import GetLanguage from "../utils/Languages";
import getConfig from "../utils/constants/getConfig";
export default class SearchResultEvent extends DisTubeBaseEvent {
  constructor() {
    super("searchResult");
  }
  async run(
    client: DiscordClient,
    message: Message,
    results: Array<SearchResult>,
    query: string
  ) {
    const config = await getConfig(client, message.guild?.id as string);
    message.channel.send({
      content: `**${GetLanguage(
        "DisTubeSearchResultChoose",
        config.language
      )}**\n${results
        .map(
          (song, i) =>
            `**${i + 1}**. ${song.name} - \`${song.formattedDuration}\``
        )
        .join("\n")}\n*${GetLanguage(
        "DisTubeSearchResultNotice",
        config.language
      )}*`,
    });
  }
}
