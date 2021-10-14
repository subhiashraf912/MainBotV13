import {
  Message,
  MessageActionRow,
  MessageSelectMenu,
  TextChannel,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "nc-event",
      category: "owner",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);

    const channel = await client.channels.fetch("898092085788426280");

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("nc-vote-menu")
        .setPlaceholder("Choose a video")
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions([
          {
            label: "Rice",
            value: "rice-vote-vid",
            description: "Vote for Rice's video",
            emoji: "1️⃣",
          },
          {
            label: "Blooming Nightcore",
            value: "bloomingnightcore-vote-vid",
            description: "Vote for Blooming Nightcore's video",
            emoji: "2️⃣",
          },
          {
            label: "Nightcore SenPai-Kuan",
            value: "senpaikuan-vote-vid",
            description: "Vote for Nightcore Senpai-Kuan's video",
            emoji: "3️⃣",
          },
          {
            label: "Shizu",
            value: "shizu-vote-vid",
            description: "Vote for Shizu's video",
            emoji: "4️⃣",
          },
          {
            label: "GameChanger Nightcore",
            value: "gamechanger-vote-vid",
            description: "Vote for GameChanger Nightcore's video",
            emoji: "5️⃣",
          },
        ])
    );
    await (channel as TextChannel).send({
      content:
        "You can vote for one of those videos:\nhttps://youtu.be/D_aGNE2Jd-A\nhttps://youtu.be/SQC0sgW8aS4\nhttps://youtu.be/zsB-oWNx_uA\nhttps://youtu.be/1CgABToESD8\nhttps://youtu.be/6LoW5tgt_Ss",
      components: [row],
    });
  }
}
