import { GuildMember, Message } from "discord.js";

const getMember = async (options: options) => {
  const cachedMembers = options.message.guild?.members.cache;
  const tagQuery = cachedMembers?.find(
    (mem) => mem.user.tag.toLowerCase() === options.query.toLowerCase()
  );
  const IdQuery = cachedMembers?.find((mem) =>
    options.query.toLowerCase().includes(mem.user.id.toLowerCase())
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
    return options.message.member as GuildMember;
  }
}
export default getMember;

type options = {
  message: Message;
  query: string;
  returnAuthor?: boolean;
}
