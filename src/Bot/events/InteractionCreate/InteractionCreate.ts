import BaseEvent from "../../utils/structures/BaseEvent";
import { GuildMember, Interaction, Role } from "discord.js";
import DiscordClient from "../../client/client";
import ageRoles from "../../utils/constants/SenServerRoles/ageRoles";
import communityRoles from "../../utils/constants/SenServerRoles/communityRoles";
import genderRoles from "../../utils/constants/SenServerRoles/genderRoles";
import colorRoles from "../../utils/constants/SenServerRoles/colorRoles";
import boosterColorRoles from "../../utils/constants/SenServerRoles/boostersColorRoles";
import pingsRoles from "../../utils/constants/SenServerRoles/pingsRoles";
import dereRoles from "../../utils/constants/SenServerRoles/dereRoles";
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
				interaction.user.id,
			) as GuildMember;

			cmd.run(client, interaction, args);
		}

		if (interaction.isContextMenu()) {
			await interaction.deferReply({ ephemeral: false });
			const command = client.slashCommands.get(interaction.commandName);
			if (command) command.run(client, interaction, []);
		}

		if (
			interaction.isSelectMenu() &&
			interaction.customId.startsWith("roles")
		) {
			const memberId = interaction.member?.user?.id;
			const guildId = interaction.guildId;
			const guild = client.guilds.cache.get(guildId as string);
			if (guild) {
				const member = guild.members.cache.get(memberId as string);
				if (member) {
					const values = interaction.values;
					const removedRoles: string[] = [];
					const addedRoles: Role[] = [];
					let roles;
					if (interaction.customId === "roles_community") {
						roles = communityRoles;
					} else if (interaction.customId === "roles_age") {
						roles = ageRoles;
					} else if (interaction.customId === "roles_color") {
						roles = colorRoles;
					} else if (interaction.customId === "roles_boosters_color") {
						if (!member.roles.cache.get("784000503620960266"))
							return interaction.reply({
								content: "This color is only for boosters.",
								ephemeral: true,
							});
						roles = boosterColorRoles;
					} else if (interaction.customId === "roles_pings") {
						roles = pingsRoles;
					} else if (interaction.customId === "roles_dere") {
						roles = dereRoles;
					} else roles = genderRoles;
					roles.forEach((roleObject) => {
						if (
							!interaction.values.includes(roleObject.role) &&
							member.roles.cache.has(roleObject.role)
						) {
							removedRoles.push(roleObject.role);
						}
					});
					for (const value of values) {
						const role = guild.roles.cache.get(value);
						if (role) {
							if (member.roles.cache.get(role.id)) {
							} else {
								await member.roles.add(role.id);
								addedRoles.push(role);
							}
						}
					}
					for (const roleToBeRemoved of removedRoles) {
						await member.roles.remove(roleToBeRemoved);
					}

					interaction.reply({
						content: `> Your new roles: ${
							addedRoles[0]
								? ` ${addedRoles.map((role) => role)}`
								: "No roles were added"
						}\n> Your removed roles: ${
							removedRoles[0]
								? ` ${removedRoles.map((role) => `<@&${role}>`)}`
								: " No roles were removed"
						}`,
						ephemeral: true,
					});
				}
			}
		}
	}
}
