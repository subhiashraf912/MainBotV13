import { Message, MessageActionRow, MessageButton } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";

export default class InviteCommand extends BaseCommand {
  constructor() {
    super({
      name: "invite",
      category: "utility",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);

    const inviteURL = `https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=8&scope=bot%20applications.commands`;
    const button = new MessageButton()
      .setLabel(GetLanguage("InviteMe", config.language))
      .setStyle("LINK")
      .setURL(inviteURL);

    const row = new MessageActionRow().addComponents(button);
    message.reply({
      content: GetLanguage("InviteMeContent", config.language),
      components: [row],
    });
  }
}
