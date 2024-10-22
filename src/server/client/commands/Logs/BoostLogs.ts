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
      name: "boost-logs",
      category: "logs",
      aliases: [],
      userPermissions: ["MANAGE_CHANNELS"],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    const config = await getConfig(client, message.guild?.id as string);
    const language = config.language;
    let logsConfig = client.LogsConfig.get(message.guild.id) || null;
    if (!logsConfig) {
      logsConfig = await LogsSchema.create({
        guildId: message.guild.id,
        ChannelLogs: null,
        BoostLogs: null,
        MemberLogs: null,
        GuildLogs: null,
        MessageLogs: null,
        RolesLogs: null,
        VoiceChannelsLogs: null,
      });
    }
    let BoostLogs: TextChannel | null;
    if (args[0] === "default") {
      BoostLogs = null;
    } else {
      const fetchedChannel = getChannel({ message, query: args.join(" ") });
      if (!fetchedChannel) {
        message.reply({ content: GetLanguage("ChannelNotFound", language) });
        return;
      }
      if (!(fetchedChannel instanceof TextChannel)) {
        message.reply({
          content: GetLanguage("TextChannelRequired", language),
        });
        return;
      }
      BoostLogs = fetchedChannel;
    }

    logsConfig = await LogsSchema.findOneAndUpdate(
      { guildId: message.guild.id },
      { BoostLogs: BoostLogs?.id },
      { new: true }
    );
    client.LogsConfig.set(message.guild.id, logsConfig as LogsType);
    message.reply(
      GetLanguage("BoostLogsUpdated", language).replaceAll(
        "{channel}",
        BoostLogs
          ? BoostLogs.toString()
          : `\`${GetLanguage("NoChannel", language)}\``
      )
    );
  }
}
