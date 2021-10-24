import { UserFlags } from "discord.js";
export default (flags: UserFlags): string => {
	let description = "User Badges:";
	flags.toArray().forEach((flag) => {
		if (flag === "BUGHUNTER_LEVEL_1")
			description = `${description}\n● Bug Hunter Level 1`;
		else if (flag === "BUGHUNTER_LEVEL_2")
			description = `${description}\n● Bug Hunter Level 2`;
		else if (flag === "DISCORD_EMPLOYEE")
			description = `${description}\n● Discord Staff`;
		else if (flag === "PARTNERED_SERVER_OWNER")
			description = `${description}\n● Discord Partner`;
		else if (flag === "EARLY_SUPPORTER")
			description = `${description}\n● Early Supporter`;
		else if (flag === "EARLY_VERIFIED_BOT_DEVELOPER")
			description = `${description}\n● Early Verified Developer`;
		else if (flag === "HOUSE_BALANCE")
			description = `${description}\n● House Balance`;
		else if (flag === "HOUSE_BRAVERY")
			description = `${description}\n● House Bravery`;
		else if (flag === "HOUSE_BRILLIANCE")
			description = `${description}\n● House Brilliance`;
		else if (flag === "HYPESQUAD_EVENTS")
			description = `${description}\n● HypeSquad Events`;
		else if (flag === "TEAM_USER") description = `${description}\n● Team User`;
		else if (flag === "VERIFIED_BOT")
			description = `${description}\n● Verified Bot`;
		else if (flag === "DISCORD_CERTIFIED_MODERATOR")
			description = `${description}\n●  Discord Certified Moderator`;
		else description = `${description}\n● ${flag}`;
	});

	return description;
};
