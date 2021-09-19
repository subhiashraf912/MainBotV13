import { GuildMember, Message } from "discord.js";

const getMember = async (options: options) => {
  const cachedMembers = options.message.guild?.members.cache;
  const tagQuery = cachedMembers?.find(
    (mem) => mem.user.tag.toLowerCase() === options.query.toLowerCase()
  );
  const IdQuery = cachedMembers?.find(
    (mem) => mem.user.id.toLowerCase() === options.query.toLowerCase()
  );
  const usernameQuery = cachedMembers?.find(
    (mem) => mem.user.username.toLowerCase() === options.query.toLowerCase()
  );
  const mentionsQuery = options.message.mentions.members?.first();
  if (mentionsQuery) return mentionsQuery;
  else if (tagQuery) return tagQuery;
  else if (IdQuery) return IdQuery;
  else if (usernameQuery) return usernameQuery;
  else {
    try {
      const guildMembers = options.message.guild?.members;
      const mem = (
        await guildMembers?.fetch({ query: options.query, limit: 1 })
      )?.first();
      if (mem) return mem;
    } catch {
      if (options.returnAuthor) return options.message.member as GuildMember;
      else return null;
    }
  }
};
export default getMember;

type options = {
  message: Message;
  query: string;
  returnAuthor?: boolean;
};
