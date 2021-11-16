import {
  Interaction,
  Message,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
} from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import Category from "../../utils/types/category.type";
const formatString = (str: string) =>
  `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

export default class HelpCommand extends BaseCommand {
  constructor() {
    super({
      name: "help",
      category: "utility",
      aliases: ["h", "commands"],
    });
  }
  get categories() {
    const categories: Category = {
      moderation: "🛠",
      music: "🎶",
      test: "🧪",
      utility: "🔧",
      owner: "⚕",
      birthdays: "🎂",
      anime: "👧",
      embeds: "📅",
      fun: "🎈",
      games: "🎮",
      "genshin impact": "🧞",
      giveaways: "🎉",
      "join roles": "🆕",
      levels: "🎚",
      logs: "🔐",
      "role playing": "🎭",
      "sen-server-commands": "🎅",
    }
    return categories;
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const config = await getConfig(client, message.guild?.id as string);
    let prefix = config.prefix;
    if (args[0]) {
      const command =
        client.commands.get(args.join(" ").toLowerCase()) ||
        client.commands.get(
          client.aliases.get(args.join(" ").toLowerCase()) as string
        );

      if (!command) {
        const relatedCommand =
          client.commands.find((command) =>
            command.getName().includes(args.join(" ").toLowerCase())
          ) ||
          client.commands.find((command) =>
            args.join(" ").toLowerCase().includes(command.getName())
          ) ||
          client.commands.get(
            client.aliases.find((command) =>
              command.toLowerCase().includes(args.join(" ").toLowerCase())
            ) as string
          ) ||
          client.commands.get(
            client.aliases.find((command) =>
              args.join(" ").toLowerCase().includes(command.toLowerCase())
            ) as string
          );
        if (relatedCommand) {
          message.reply({
            content: GetLanguage(
              "CommandNotFoundButFoundRelatedCommand",
              config.language
            ).replaceAll("{command}", relatedCommand.getName()),
          });
        } else {
          message.reply({
            content: GetLanguage("CommandNotFound", config.language),
          });
        }
        return;
      }

      const embed = new MessageEmbed()
        .setDescription(
          `**${GetLanguage("BotCommandHelp", config.language).replaceAll(
            "{bot}",
            client.user?.username as string
          )}**\n\`\`\`css\n${formatString(
            command
              .getName()
              .replaceAll("-", " ")
              .replaceAll("-", " ")
              .replaceAll("-", " ")
          )} ${GetLanguage("Help", config.language)}\`\`\``
        )
        .addField(
          `> ${GetLanguage("Category", config.language)}:`,
          `\`\`\`${command.getCategory()}\`\`\``,
          true
        )
        .addField(
          `> ${GetLanguage("Description", config.language)}:`,
          `\`\`\`${command.getDescription(config.language)}\`\`\``,
          true
        )
        .addField(
          `> ${GetLanguage("Usage", config.language)}:`,
          `\`\`\`${command
            .getUsage(config.language)
            .replaceAll("{prefix}", prefix)
            .replaceAll("<prefix>", prefix)}\`\`\``
        )
        .addField(
          `> ${GetLanguage("Aliases", config.language)}:`,
          `\`\`\`${
            command.getAliases()[0]
              ? command.getAliases()
              : GetLanguage("NoAliases", config.language)
          }\`\`\``,
          true
        )
        .addField(
          `> ${GetLanguage("RequiredBotPermissions", config.language)}:`,
          `\`\`\`${
            command.getBotPermissions()[0]
              ? command
                  .getBotPermissions()
                  .map((perm) => `${formatString(perm.replaceAll("_", " "))}`)
              : GetLanguage("NoPermissionsRequired", config.language)
          }\`\`\``,
          true
        )

        .addField(
          `> ${GetLanguage("RequiredUserPermissions", config.language)}`,
          `\`\`\`${
            command.getUserPermissions()[0]
              ? command
                  .getUserPermissions()
                  .map((perm) => `${formatString(perm.replaceAll("_", " "))}`)
              : GetLanguage("NoPermissionsRequired", config.language)
          }\`\`\``
        )
        .setFooter(
          GetLanguage("BotsCommandsHelpSection", config.language).replaceAll(
            "{bot}",
            client.user?.tag as string
          )
        )
        .setImage(command.tutorialGif);
      message.channel.send({ embeds: [embed] });
      return;
    }

    const directories = [
      ...new Set(client.commands.map((cmd) => cmd.getCategory())),
    ];

    const categories = directories.map((dir) => {
      const getCommands = client.commands
        .filter((cmd) => cmd.getCategory() === dir)
        .map((cmd) => {
          return {
            name: cmd.getName(),
            description: cmd.getDescription(config.language),
          }
        });
      return {
        directory: formatString(dir),
        commands: getCommands,
      }
    });

    const embed = new MessageEmbed()
      .setDescription(
        GetLanguage("BotsHelpList", config.language)
          .replaceAll("{bot}", formatString(client.user?.username as string))
          .replaceAll("{prefix}", prefix)
      )
      .addFields(
        directories.map((category) => {
          return {
            name: `> ${this.categories[category] || ""} ${formatString(
              category
            )}`,
            value: `\`\`\`css\n${GetLanguage(
              "MenuCategoriesValues",
              config.language
            ).replaceAll("{category}", category)}\`\`\``,
            inline: true,
          }
        })
      )
      .setFooter(GetLanguage("CategoriesMenuEmbedFooter", config.language));

    const components = (state: boolean) => [
      new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("help-menu")
          .setPlaceholder(GetLanguage("HelpMenuPlaceHolder", config.language))
          .setDisabled(state)
          .addOptions([
            {
              label: GetLanguage("HelpMainPage", config.language),
              value: "home-page",
              description: GetLanguage(
                "HelpMainPageOptionDescription",
                config.language
              ),
              emoji: "🏠",
            },
          ])
          .addOptions(
            categories.map((cmd) => {
              return {
                label: cmd.directory,
                value: cmd.directory.toLowerCase(),
                description: GetLanguage(
                  "HelpMenuOptionsDescription",
                  config.language
                ).replaceAll("{option}", cmd.directory),
                emoji:
                  this.categories[
                    cmd.directory.toLowerCase() as keyof Category
                  ] || "",
              }
            })
          )
      ),
    ];
    const initialMessage = await message.reply({
      embeds: [embed],
      components: components(false),
    });
    const filter = (interaction: Interaction): boolean => {
      return interaction.user.id === message.author.id;
    }
    const collector = message.channel.createMessageComponentCollector({
      filter,
      componentType: "SELECT_MENU",
      // time: 5000,
    });

    collector.on("collect", (interaction: any) => {
      const [directory] = interaction.values;
      if (directory === "home-page") {
        interaction.update({ embeds: [embed] });
        return;
      }
      const category = categories.find(
        (x) => x.directory.toLowerCase() === directory
      );
      const categoryEmbed = new MessageEmbed()
        .setTitle(
          GetLanguage("HelpCategoryEmbedTitle", config.language).replaceAll(
            "{category}",
            formatString(directory)
          )
        )
        .setDescription(
          GetLanguage(
            "HelpCategoryEmbedDescription",
            config.language
          ).replaceAll("{prefix}", prefix)
        )
        .addFields(
          (
            category as {
              directory: string;
              commands: {
                name: string;
                description: string;
              }[];
            }
          ).commands.map((cmd) => {
            return {
              name: `${cmd.name}`,
              value: `\`${cmd.description}\``,
              inline: true,
            }
          })
        );
      interaction.update({ embeds: [categoryEmbed] });
    });
    collector.on("end", () => {
      initialMessage.edit({ components: components(true) });
    });
  }
}
