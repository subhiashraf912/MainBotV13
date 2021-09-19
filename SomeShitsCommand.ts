import {
  Message,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
} from "discord.js";
import BaseCommand from "./src/Bot/utils/structures/BaseCommand";
import DiscordClient from "./src/Bot/client/client";
import getConfig from "./src/Bot/utils/constants/getConfig";
const formatString = (str: string) =>
  `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

export default class TestCommand extends BaseCommand {
  constructor() {
    super({
      name: "test",
      category: "utility",
      aliases: ["h", "commands"],
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    let prefix = (await getConfig(client, message.guild?.id as string)).prefix;

    const roles = [
      {
        emoji: "🤣",
        role: "884367171159994419",
      },
      {
        emoji: "🙂",
        role: "884367213811863553",
      },
      {
        emoji: "😶",
        role: "884367212637470741",
      },
      {
        emoji: "😪",
        role: "884367211953815572",
      },
      {
        emoji: "😥",
        role: "884367210557100053",
      },
      {
        emoji: "😆",
        role: "884367209768566804",
      },
      {
        emoji: "😑",
        role: "884367209072312400",
      },
      {
        emoji: "😆",
        role: "884367208141189150",
      },
      {
        emoji: "🤐",
        role: "884367202483052614",
      },
      {
        emoji: "😫",
        role: "884367189380067358",
      },
    ];
    const actualRoles = [
      ...new Set(
        roles.map((role) => message.guild?.roles.cache.get(role.role))
      ),
    ];

    const components = (state: boolean) => [
      new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("roles")
          .setMaxValues(roles.length)
          .setMinValues(0)
          .setPlaceholder("Please select a category")
          .setDisabled(state)
          .addOptions(
            actualRoles.map((role) => {
              return {
                label: role?.name || "Unkown shit",
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

    const embed = new MessageEmbed().setTitle(`Roles shits`);
    await message.reply({
      embeds: [embed],
      components: components(false),
    });
  }
}
