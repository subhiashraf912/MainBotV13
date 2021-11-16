import { Channel, GuildChannel, Message, TextChannel } from "discord.js";

export default (options: optionsType) => {
  let channel: Channel | undefined;
  channel =
    options.message.guild?.channels.cache.get(options.query) ||
    options.message.guild?.channels.cache.find(
      (ch) => ch.name.toLowerCase() === options.query.toLowerCase()
    ) ||
    options.message.mentions.channels.first();
  if (!channel && options.returnMessageChannel) {
    channel = options.message.channel as TextChannel;
  }
  return channel as GuildChannel;
}

type optionsType = {
  message: Message;
  query: string;
  returnMessageChannel?: boolean;
}
