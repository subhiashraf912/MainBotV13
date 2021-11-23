import { Message, TextChannel } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import { LogsSchema } from "../../utils/MongoDB/Models";
import getChannel from "../../utils/constants/getChannel";
import LogsType from "../../../../types/Logs.Interface";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "all-logs",
      category: "logs",
      aliases: [],
      userPermissions: ["MANAGE_CHANNELS"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);

    if (!message.guild || !message.member) return;

    const language = config.language;
    let logsConfig = client.LogsConfig.get(message.guild.id) || null;
    if (!logsConfig) {
      logsConfig = await LogsSchema.create({
        guildId: message.guild.id,
        ChannelLogs: null,
        BoostLogs: null,
        MessageLogs: null,
        GuildLogs: null,
        MemberLogs: null,
        RolesLogs: null,
        VoiceChannelsLogs: null,
      });
    }
    let channel: TextChannel | null | undefined;
    if (args[0] === "default") {
      channel = null;
    } else {
      const fetchedChannel = getChannel({ message, query: args.join(" ") });

      if (!fetchedChannel) {
        message.reply({
          content: GetLanguage("ChannelNotFound", language),
        });
        return;
      }
      if (!(fetchedChannel instanceof TextChannel)) {
        message.reply(GetLanguage("TextChannelRequired", language));
        return;
      }
    }

    logsConfig = await LogsSchema.findOneAndUpdate(
      { guildId: message.guild.id },
      {
        ChannelLogs: channel?.id,
        BoostLogs: channel?.id,
        MessageLogs: channel?.id,
        GuildLogs: channel?.id,
        MemberLogs: channel?.id,
        RolesLogs: channel?.id,
        VoiceChannelsLogs: channel?.id,
      },
      { new: true }
    );
    client.LogsConfig.set(message.guild.id, logsConfig as LogsType);
    message.reply(
      GetLanguage("AllLogsUpdated", language).replaceAll(
        "{channel}",
        channel
          ? channel.toString()
          : `\`${GetLanguage("NoChannel", language)}\``
      )
    );
  }
}
