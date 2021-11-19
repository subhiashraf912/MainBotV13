import BaseEvent from "../../utils/structures/BaseEvent";
import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import Chatbot from "../../utils/Modules/discord-chatbot";
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
    const chatbot = new Chatbot({
      name: client.user?.username!,
      gender: 'Female',
      user: message.author.id,
    });
    const args = message.content;

              if (args.includes('Aze') || args.includes('aze')) {
                  args.toLocaleLowerCase().replace('aze', 'udit');
    }
    chatbot
      .chat(args)
      .then((data: string) => {
        if (data.toLowerCase().includes('udit')) {
          let str = data.replaceAll(
            'Udit',
            'Aze Sama',
          ).replaceAll('udit',"Aze Sama")
          message.reply(str);
        } else {
          message.reply(data);
        }
      })
      .catch((e: Error) => console.log(e.message));
  }
}