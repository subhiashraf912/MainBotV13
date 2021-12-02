import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../classes/client';
import { GuildConfig } from '../../utils/MongoDB/Models';
import { Message } from 'discord.js';
export default class WelcomeMessageCommand extends BaseCommand {
      constructor() {
            super({
                  name: 'welcome-message', category: 'Welcomes',
                  userPermissions:['MANAGE_GUILD']
            });
      }

      async run(
            client: DiscordClient,
            message: Message,
            args: Array<string>,
      ) {
            if (!message.guild || !message.member) return;
            if (!args[0])
            {
                  message.reply(
                        'You need to send the text of the welcome message!',
            ); return
            };
            let welcomeMessage: string | null = args.join(' ');
            if (args[0] === 'default') welcomeMessage = null;
            const config = await GuildConfig.findOneAndUpdate(
                  { guildId: message.guild.id },
                  { welcomeMessage },
                  { new: true },
            );
            client.configs.set(message.guild.id, config!);
            welcomeMessage
                  ? message.reply(
                          'The welcome message text has been updated!',
                    )
                  : message.reply(
                          'The welcome message text has been rested to default!',
                    );
      }
}
