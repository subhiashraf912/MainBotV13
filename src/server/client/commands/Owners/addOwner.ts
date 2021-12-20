import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import OwnersConfig from '../../utils/MongoDB/Models/OwnersConfig';
import getOwners from "../../utils/constants/getOwners";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "add-owner",
      category: "owner",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    
    const owner = message.mentions.users.first();
    if (!owner) {
      message.reply("You need to mention the user you want to make owner.");
      return
    }

    await OwnersConfig.create({
      clientId: client.user?.id,
      userId: owner.id
    })
    
    await getOwners(client)
    message.reply("Added Successfully")
  }
}
