import { User } from "discord.js";
import DiscordClient from "../../classes/client";

const getDevelopers = async (options: options) => {
  const developer =
    options.client.users.cache.get("849641637831376936") ||
    (await options.client.users.fetch("849641637831376936"));
  return developer as User;
};

type options = {
  client: DiscordClient;
};

export default getDevelopers;
