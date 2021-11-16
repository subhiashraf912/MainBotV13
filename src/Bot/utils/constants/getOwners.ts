import DiscordClient from "../../client/client";
import OwnersConfig from "../MongoDB/Models/OwnersConfig";
import config from "../../config.json";
type ownersConfig = { userId: string; clientId: string }[];
export default async (client: DiscordClient) => {
  const owners: any = await OwnersConfig.find();
  const envOwner = process.env.MAIN_OWNER || config.mainOwner;
  owners.push({ userId: envOwner, clientId: client.user?.id });
  for (const owner of owners as ownersConfig) {
    const user =
      client.users.cache.get(owner.userId) ||
      (await client.users.fetch(owner.userId));
    client.owners.set(owner.userId, user);
  }
}
