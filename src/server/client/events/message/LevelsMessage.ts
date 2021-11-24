import BaseEvent from "../../utils/structures/BaseEvent";
import { Message } from "discord.js";
import DiscordClient from "../../classes/client";
import getConfig from "../../utils/constants/getConfig";
import GetLanguage from "../../utils/Languages";
import { RankSchema } from "../../utils/MongoDB/Models";
import mongoose from "mongoose";

export default class LevelsMessageEvent extends BaseEvent {
  constructor() {
    super("messageCreate");
  }

  async run(client: DiscordClient, message: Message) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const config = await getConfig(client, message.guild.id);
    let prefix = config.prefix;
    if (message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;

    if (!config.isLevelSystemEnabled) return;
    if (config && config.levelsChannels) {
      if (config.levelsChannels[0]) {
        let levelsChannels = config.levelsChannels;
        if (!levelsChannels.includes(message.channel.id)) return;
      }
    }

    if (!config) return;
    let rank: any = client.ranks.get(
      `${message.author.id}-${message.guild.id}`
    );
    if (!rank) {
      rank = await RankSchema.findOne({
        user: message.author.id,
        server: message.guild.id,
      });

      if (!rank) {
        rank = await RankSchema.create({
          _id: new mongoose.Types.ObjectId(),
          user: message.author.id,
          server: message.guild.id,
          level: 0,
          xp: 0,
          lastMessage: Date.now(),
        });
      }
    }
    if (!rank) return;
    else client.ranks.set(`${message.author.id}-${message.guild.id}`, rank);

    if (Date.now() - rank.lastMessage > 60000) {
      let level = rank.level;
      let xp = rank.xp;
      let RandomNumberBetween15;
      if (message.channel.id === "800314338534883348") {
        RandomNumberBetween15 = this.getRandomInt(
          config.minXpPerMessage * 2,
          config.maxXpPerMessage * 2
        );
      } else {
        RandomNumberBetween15 = this.getRandomInt(
          config.minXpPerMessage,
          config.maxXpPerMessage
        );
      }
      xp += RandomNumberBetween15;

      const xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100;
      if (xp >= xpToNextLevel) {
        level++;
        xp = xp - xpToNextLevel;
        const channel = message.channel;
        let levelRoles = config.levelRoles;
        channel.send(
          GetLanguage("MemberHasLeveledUp", config.language)
            .replace("{member}", message.author.toString())
            .replace("{level}", level)
        );
        if (levelRoles)
          this.assignRoles(message, levelRoles, level, config.language);
      }

      rank = await RankSchema.findOneAndUpdate(
        {
          server: message.guild.id,
          user: message.author.id,
        },
        {
          $set: {
            level,
            xp,
            lastMessage: Date.now(),
          },
        },
        { new: true }
      );
      if (rank)
        client.ranks.set(`${message.author.id}-${message.guild.id}`, rank);
    }
  }

  assignRoles(
    message: Message,
    AutoRoles: any,
    level: number,
    language: string
  ) {
    if (!message.guild || !message.member) return;
    let role = message.guild.roles.cache.find(
      (role) => role.id === AutoRoles[level]
    );
    if (!role) return;
    message.member.roles
      .add(role)
      .then(() => {
        message.channel.send(
          GetLanguage("MemberGotLevelRole", language)
            .replace("{member}", message.author.toString())
            .replace("{role}", role?.name!)
        );
      })
      .catch((err) => {
        if (err) {
          message.channel
            .send(
              GetLanguage("ClientCanNotAddLevelRole", language)
                .replace("{member}", message.author.toString())
                .replace("{role}", role?.name!)
            )
            .then((message) => {
              setTimeout(() => {
                message.delete();
              }, 5000);
            });
        }
      });
  }
  getRandomInt(min: number, max: number) {
    const randomfloat: any = (Math.random() * (max - min) + min).toString();
    return parseInt(randomfloat.split("."), 10);
  }
}
