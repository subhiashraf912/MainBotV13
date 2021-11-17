import DiscordClient from "../../client/client";
import GuildConfig from "../MongoDB/Models/GuildConfig";
type configType = {
  guildId: string;
  clientId: string;
  prefix: string;
};
export default async (client: DiscordClient, guildId: string) => {
  await GuildConfig.deleteMany({
    guildId,
    clientId: client.user?.id,
  });
  client.configs.delete(guildId);

  return true;
};
