import BaseEvent from '../../../utils/structures/BaseEvent';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import DiscordClient from '../../../classes/client';
export default class MessageEvent extends BaseEvent {
      constructor() {
            super('message');
      }

      async run(client: DiscordClient, message: Message) {
            try {
                  if (message.channel.type !== 'DM') return;
            if (message.author.id === client.user?.id)
                  return;
            let attachments = '';
            message.attachments.forEach((attachment) => {
                  attachments = `${attachments}\n${attachment.url}`;
            });
            const icon =
                  message.author.displayAvatarURL({
                        size: 4096,
                        format: 'png',
                  }) || '';
            const channel = await client.channels.fetch(
                  '913084207620821033',
            );
            if (channel?.type !== 'GUILD_TEXT') return;
            const embed = new MessageEmbed()
                  .setTitle(`${client.user?.username} DMS Logs`)
                  .setDescription(
                        `
    \`\`\`
    By: ${message.author.tag}
    \`\`\`
    \`\`\`
    Content: ${message.content}
    \`\`\`
    \`\`\`
    Attachments: ${attachments}
    \`\`\`
    By: ${message.author}
      `,
                  )
                  .setTimestamp()
                  .setAuthor(`${message.author.username}`, icon);
            (channel as TextChannel).send({embeds:[embed]});
            } catch (err) {
                  
            }
            
      }
}
