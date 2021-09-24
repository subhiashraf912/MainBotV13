import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import fs from "fs";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "restart",
      category: "owner",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const msg = await message.channel.send("Restarting...");
    let restarts: { messageId: string; channelId: string } = JSON.parse(
      fs.readFileSync("restarts.json", "utf8")
    );
    restarts.messageId = msg.id;
    restarts.channelId = msg.channel.id;
    console.log(restarts);
    const restartsStringified = JSON.stringify(restarts);
    console.log(restartsStringified);
    fs.writeFileSync("restarts.json", restartsStringified);
    process.exit();
  }
}
