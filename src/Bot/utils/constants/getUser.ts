import { Message } from "discord.js";

const getUser = async (options: options) => {
  const cachedMembers = options.message.client?.users.cache;
  const tagQuery = cachedMembers?.find(
    (user) => user.tag.toLowerCase() === options.query.toLowerCase()
  );
  const IdQuery = cachedMembers?.find(
    (user) => user.id.toLowerCase() === options.query.toLowerCase()
  );
  const usernameQuery = cachedMembers?.find(
    (user) => user.username.toLowerCase() === options.query.toLowerCase()
  );
  const mentionsQuery = options.message.mentions.users?.first();
  if (mentionsQuery) return mentionsQuery;
  else if (tagQuery) return tagQuery;
  else if (IdQuery) return IdQuery;
  else if (usernameQuery) return usernameQuery;
  else {
    try {
      const clientUsers = options.message.client.users;
      const us = await clientUsers?.fetch(options.query, {
        cache: true,
      });
      if (us) return us;
    } catch {
      return undefined;
    }
  }
}
export default getUser;

type options = {
  message: Message;
  query: string;
}
