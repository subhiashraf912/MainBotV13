import BaseEvent from "../../utils/structures/BaseEvent";
import { GuildMember, Interaction, Role } from "discord.js";
import DiscordClient from "../../client/client";
import NCVotes from "../../utils/MongoDB/Models/NCVotes";

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

    if (interaction.isSelectMenu() && interaction.customId === "nc-vote-menu") {
      const memberId = interaction.member?.user?.id;
      const guildId = interaction.guildId;
      const guild = client.guilds.cache.get(guildId as string);
      const ncVotes = await NCVotes.findOne({ guildId: guild?.id });
      if (interaction.values[0]) {
        const selected = interaction.values[0];
        //1
        if (selected === "rice-vote-vid") {
          const votes = ncVotes?.rice;
          if (!((ncVotes?.rice.indexOf(memberId as string) as number) > -1)) {
            votes?.splice(
              ncVotes?.rice.indexOf(interaction.user.id as string) as number,
              1
            );
          }
          votes?.push(memberId as string);
          await NCVotes.findOneAndUpdate(
            {
              guildId: guildId as string,
            },
            {
              rice: votes,
            }
          );
          interaction.reply({ content: "You have voted Rice" });
        }
        //2
        if (selected === "bloomingnightcore-vote-vid") {
          const votes = ncVotes?.bloomingnightcore;
          if (
            !(
              (ncVotes?.bloomingnightcore.indexOf(
                memberId as string
              ) as number) > -1
            )
          ) {
            votes?.splice(
              ncVotes?.bloomingnightcore.indexOf(
                interaction.user.id as string
              ) as number,
              1
            );
          }
          votes?.push(memberId as string);
          await NCVotes.findOneAndUpdate(
            {
              guildId: guildId as string,
            },
            {
              bloomingnightcore: votes,
            }
          );
          interaction.reply({ content: "You have voted Rice" });
        }
        //3
        if (selected === "senpaikuan-vote-vid") {
          const votes = ncVotes?.senpai;
          if (!((ncVotes?.senpai.indexOf(memberId as string) as number) > -1)) {
            votes?.splice(
              ncVotes?.senpai.indexOf(interaction.user.id as string) as number,
              1
            );
          }
          votes?.push(memberId as string);
          await NCVotes.findOneAndUpdate(
            {
              guildId: guildId as string,
            },
            {
              senpai: votes,
            }
          );
          interaction.reply({ content: "You have voted Senpai Kuan" });
        }
        //4
        if (selected === "shizu-vote-vid") {
          const votes = ncVotes?.shizu;
          if (!((ncVotes?.shizu.indexOf(memberId as string) as number) > -1)) {
            votes?.splice(
              ncVotes?.shizu.indexOf(interaction.user.id as string) as number,
              1
            );
          }
          votes?.push(memberId as string);
          await NCVotes.findOneAndUpdate(
            {
              guildId: guildId as string,
            },
            {
              shizu: votes,
            }
          );
          interaction.reply({ content: "You have voted Shizu" });
        }
        //5
        if (selected === "gamechanger-vote-vid") {
          const votes = ncVotes?.gamechanger;
          if (
            !((ncVotes?.gamechanger.indexOf(memberId as string) as number) > -1)
          ) {
            votes?.splice(
              ncVotes?.gamechanger.indexOf(
                interaction.user.id as string
              ) as number,
              1
            );
          }
          votes?.push(memberId as string);
          await NCVotes.findOneAndUpdate(
            {
              guildId: guildId as string,
            },
            {
              gamechanger: votes,
            }
          );
          interaction.reply({
            content: "You have voted GameChanger Nightcore",
          });
        }
      }
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
