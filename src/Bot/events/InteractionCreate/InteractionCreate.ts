import BaseEvent from "../../utils/structures/BaseEvent";
import { GuildMember, Interaction, Role } from "discord.js";
import DiscordClient from "../../client/client";

export default class MessageEvent extends BaseEvent {
  constructor() {
    super("interactionCreate");
  }

  async run(client: DiscordClient, interaction: Interaction) {
    if (interaction.isCommand()) {
      await interaction.deferReply().catch(() => {});

      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd)
        return interaction.followUp({
          content: "An error has occured!",
        });
      const args: string[] = [];

      for (let option of interaction.options.data) {
        if (option.type === "SUB_COMMAND") {
          if (option.name) args.push(option.name);
          option.options?.forEach((x) => {
            if (x.value) args.push(x.value as string);
          });
        } else if (option.value) args.push(option.value as string);
      }
      interaction.member = interaction.guild?.members.cache.get(
        interaction.user.id
      ) as GuildMember;

      cmd.run(client, interaction, args);
    }

    if (interaction.isContextMenu()) {
      await interaction.deferReply({ ephemeral: false });
      const command = client.slashCommands.get(interaction.commandName);
      if (command) command.run(client, interaction, []);
    }

    if (interaction.isSelectMenu() && interaction.customId === "roles") {
      await interaction.deferReply({ ephemeral: true });
      const memberId = interaction.member?.user?.id;
      const guildId = interaction.guildId;
      const guild = client.guilds.cache.get(guildId as string);
      if (guild) {
        const member = guild.members.cache.get(memberId as string);
        if (member) {
          const values = interaction.values;
          const removedRoles: Role[] = [];
          const addedRoles: Role[] = [];
          for (const value of values) {
            const role = guild.roles.cache.get(value);
            if (role) {
              if (member.roles.cache.get(role.id)) {
                await member.roles.remove(role);
                removedRoles.push(role);
              } else {
                await member.roles.add(role.id);
                addedRoles.push(role);
              }
            }
          }
          interaction.editReply({
            content: `${
              addedRoles[0]
                ? `Added the roles ${addedRoles.map((role) => role)}`
                : ""
            }\n${
              removedRoles[0]
                ? `Removed the roles ${removedRoles.map((role) => role)}`
                : ""
            }`,
          });
        }
      }
    }
  }
}
