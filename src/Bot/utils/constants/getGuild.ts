import { Guild, Message } from "discord.js";

const getGuild = (options: options) => {
  const guild =
    options.message.client.guilds.cache.get(options.query) ||
    options.message.client.guilds.cache.find(
      (g) => g.name.toLowerCase() === options.query.toLowerCase()
    ) ||
    (options.message.guild as Guild);
  return guild;
}

export default getGuild;
type options = {
  query: string;
  message: Message;
}
