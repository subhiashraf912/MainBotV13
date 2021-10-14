import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import NCVotes from "../../utils/MongoDB/Models/NCVotes";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "nc-event-votes",
      category: "utility",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);

    const votes = await NCVotes.findOne({
      guildId: message.guild?.id as string,
    });

    message.reply({
      content: `> **Rice:** ${votes?.rice.length.toString()}\n> **Blooming Nightcore:** ${votes?.bloomingnightcore.length.toString()}\n> **Nightcore Senpai Kuan:** ${votes?.senpai.length.toString()}\n> **Shizu:** ${votes?.shizu.length.toString()}\n> **GameChanger Nightcore:** ${votes?.gamechanger.length.toString()}\n`,
    });
  }
}
