import {
  Message,
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import roles from "../../utils/constants/SenServerRoles/dereRoles";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "dere-roles",
      category: "sen-server-commands",
      aliases: [],
      userPermissions: ["MANAGE_ROLES"],
      botPermissions: ["MANAGE_ROLES"],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);
    if (message.guild?.id !== "783991881028993045") {
      message.reply("This command is only for sen nightcore server");
      return;
    }

    const actualRoles = [
      ...new Set(
        roles.map((role) => message.guild?.roles.cache.get(role.role))
      ),
    ];

    const components = (state: boolean) => [
      new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("roles_dere")
          .setMaxValues(roles.length)
          .setMinValues(0)
          .setPlaceholder("Please select a role")
          .setDisabled(state)
          .addOptions(
            actualRoles.map((role) => {
              return {
                label: role?.name || "Unkown role",
                value: role?.id || "Unkown",
                description: `Gives/Removes the ${role?.name} role from you!`,
                emoji:
                  roles.find((roleObj) => roleObj.role === role?.id)?.emoji ||
                  "",
              };
            })
          )
      ),
    ];

    const embed = new MessageEmbed()
      .setDescription(
        "```Dere Roles```\nYou can choose your dere roles from here. So other members can know your dere type by clicking on your profile!"
      )
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 4096 }) || "");
    await message.channel.send({
      embeds: [embed],
      components: components(false),
    });
  }
}
