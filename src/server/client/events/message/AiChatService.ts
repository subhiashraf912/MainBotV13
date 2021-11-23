import BaseEvent from "../../utils/structures/BaseEvent";
import { Message } from "discord.js";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import { Bot } from "smart-botto";
export default class AiChatEvent extends BaseEvent {
  constructor() {
    super("messageCreate");
  }

  async run(client: DiscordClient, message: Message) {
    if (message.author.bot) return;
    if (!message.guild) {
      return;
    }

    const config = await getConfig(client, message.guild.id);
    if (message.channelId !== config.aiChatChannel) return;
    const chatbot = new Bot(client.user?.username!);
    let args = message.content;

    if (args.includes("Aze") || args.includes("aze"))
      args = args.toLocaleLowerCase().replace("aze", "udit");
    chatbot
      .chat({
        message: args,
        user: message.author.id,
      })
      .then((res) => message.reply(res.response));
  }
}
