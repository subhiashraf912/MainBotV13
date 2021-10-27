import {
  Message,
  MessageEmbed,
  MessageComponentInteraction,
  MessageButton,
  MessageActionRow,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import getMember from "../../utils/constants/getMember";
import getDevelopers from "../../utils/constants/GetDevelopers";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "avatar",
      category: "utility",
      aliases: [],
      userPermissions: [],
      botPermissions: [],
      tutorialGif: "",
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    const config = await getConfig(client, message.guild?.id as string);

    const language = config.language;

    const developer = await getDevelopers({ client });
    const target = await getMember({
      message,
      query: args.join(" "),
      returnAuthor: true,
    });
    const guildAvatar = target.avatarURL({
      dynamic: true,
      size: 4096,
    });
    const userAvatar = target.user.displayAvatarURL({
      dynamic: true,
      size: 4096,
    });
    const userAvatarEmbed: MessageEmbed = new MessageEmbed()
      .setDescription(
        `\`\`\`${GetLanguage("RequestedBy", language).replaceAll(
          "{user}",
          message.author.tag
        )}\`\`\``
      )
      .setAuthor(target.user.tag, userAvatar)
      .setFooter(
        `${GetLanguage("Developer", config.language)}: ${developer.tag}`,
        developer.displayAvatarURL({ dynamic: true, size: 4096 })
      )
      .setImage(userAvatar);
    const GuildAvatarEmbed: MessageEmbed = new MessageEmbed()
      .setDescription(
        `\`\`\`${GetLanguage("RequestedBy", language).replaceAll(
          "{user}",
          message.author.tag
        )}\`\`\``
      )
      .setAuthor(target.user.tag, guildAvatar || userAvatar)
      .setFooter(
        `${GetLanguage("Developer", config.language)}: ${developer.tag}`,
        developer.displayAvatarURL({ dynamic: true, size: 4096 })
      )
      .setImage(guildAvatar || userAvatar);
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(`GuildAvatar`)
        .setStyle("PRIMARY")
        .setLabel("Server Avatar")
        .setEmoji("👤"),
      new MessageButton()
        .setCustomId(`UserAvatar`)
        .setLabel("User Avatar")
        .setStyle("PRIMARY")
        .setEmoji("👤")
    );
    const msg = await message.reply({
      embeds: [userAvatarEmbed],
      components: [row],
    });

    const filter = (i: MessageComponentInteraction) =>
      i.user.id === message.author.id && i.message.id === msg.id;

    const collector = message.channel.createMessageComponentCollector({
      filter,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "GuildAvatar") {
        await i.update({
          embeds: [GuildAvatarEmbed],
          components: [row],
        });
      } else if (i.customId === "UserAvatar") {
        await i.update({
          embeds: [userAvatarEmbed],
          components: [row],
        });
      }
    });
  }
}
