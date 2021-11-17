import DiscordClient from "../../client/client";
import GuildConfig from "../MongoDB/Models/GuildConfig";
import configType from "../types/GuildConfig";

export default async (client: DiscordClient, guildId: string) => {
  let config: any | configType = client.configs.get(guildId);
  if (!config) {
    config = await GuildConfig.findOne({ guildId, clientId: client.user?.id });
    if (!config)
      config = await GuildConfig.create({
        guildId,
        clientId: client.user?.id,
        prefix: client.mainPrefix,
      });
    client.configs.set(guildId, config as configType);
  }
  return config as configType;
};
