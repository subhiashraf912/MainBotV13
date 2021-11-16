import { Message } from "discord.js";

const getRole = async (options: options) => {
  const role =
    options.message.mentions.roles.first() ||
    options.message.guild?.roles.cache.get(options.query) ||
    options.message.guild?.roles.cache.find(
      (r) => r.name.toLowerCase() === options.query.toLowerCase()
    ) ||
    options.message.guild?.roles.fetch(options.query) ||
    null;
  return role;
}

export default getRole;

type options = {
  message: Message;
  query: string;
}
