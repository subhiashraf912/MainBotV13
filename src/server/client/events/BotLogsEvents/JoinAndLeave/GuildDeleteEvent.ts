import { Guild, MessageEmbed } from 'discord.js';
import BaseEvent from '../../../utils/structures/BaseEvent';
import DiscordClient from '../../../classes/client';
import { GuildConfig, LogsSchema } from '../../../utils/MongoDB/Models';

export default class GuildDeleteEvent extends BaseEvent {
      constructor() {
            super('guildDelete');
      }

      async run(client: DiscordClient, guild: Guild) {
            const icon = guild.iconURL({ size: 4096, format: 'png' }) || '';
            const channel: any = await client.channels.fetch(
                  '854015039823937537',
            );
            if (channel.type !== 'text') return;
            if (!channel) return;
            const embed = new MessageEmbed()
                  .setTitle(`${client.user?.username} Leave Logs`)
                  .setDescription(
                        `
    \`\`\`
    Server Name: ${guild.name}
    \`\`\`
    \`\`\`
    Server ID: ${guild.id}
    \`\`\`
    \`\`\`
    Server Owner: ${guild.owner?.user.tag}
    \`\`\`
    \`\`\`
    \`\`\`
    Owner: ${guild.owner}
      `,
                  )
                  .setTimestamp()
                  .setAuthor(`${guild.name}`, icon);
            channel.send(embed);
      }
}
