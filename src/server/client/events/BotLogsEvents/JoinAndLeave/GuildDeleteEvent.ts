import { Guild, MessageEmbed, TextChannel } from 'discord.js';
import BaseEvent from '../../../utils/structures/BaseEvent';
import DiscordClient from '../../../classes/client';

export default class GuildDeleteEvent extends BaseEvent {
      constructor() {
            super('guildDelete');
      }

      async run(client: DiscordClient, guild: Guild) {
            const ownerId = guild.ownerId;
            const ownerUser = await client.users.fetch(ownerId);
            const icon = guild.iconURL({ size: 4096, format: 'png' }) || '';
            const channel = await client.channels.fetch(
                  '913084124703645716',
            );
            if (channel?.type !== 'GUILD_TEXT') return;
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
    Server Owner: ${ownerUser.tag}
    \`\`\`
    \`\`\`
    \`\`\`
    Owner: ${ownerUser}
      `,
                  )
                  .setTimestamp()
                  .setAuthor(`${guild.name}`, icon);
            (channel as TextChannel).send({embeds:[embed]});
      }
}
