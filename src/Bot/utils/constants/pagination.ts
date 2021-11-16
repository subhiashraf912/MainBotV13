const defaultEmojis: any = {
  first: "⬅️",
  previous: "◀️",
  next: "▶️",
  last: "➡️",
  number: "#️⃣",
}
const defaultStyles: any = {
  first: "PRIMARY",
  previous: "PRIMARY",
  next: "PRIMARY",
  last: "PRIMARY",
  number: "SUCCESS",
}
import {
  ButtonInteraction,
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
  User,
} from "discord.js";
type ButtonNames = "first" | "previous" | "next" | "last" | "number";

interface Button {
  name: ButtonNames;
  emoji?: string;
  style?: "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER";
}

interface PaginationOptions {
  message: Message | CommandInteraction;
  embeds: MessageEmbed[];
  button?: Button[];
  pageTravel?: boolean;
  fastSkip?: boolean;
  time?: number;
  max?: number;
  customFilter?(interaction: ButtonInteraction): boolean;
}
const pagination = async (options: PaginationOptions) => {
  const {
    embeds,
    button,
    time,
    max,
    customFilter,
    fastSkip,
    pageTravel,
    message,
  } = options;
  let author: User;
  let channel: TextChannel;
  if (message instanceof CommandInteraction) {
    author = message.user;
    channel = message.channel as TextChannel;
  } else if (message instanceof Message) {
    author = message.author;
    channel = message.channel as TextChannel;
  } else {
    return;
  }

  let currentPage = 1;
  const getButtonData = (name: string) => {
    return button?.find((btn) => btn.name === name);
  }
  const generateButtons = (state: boolean) => {
    const checkState = (name: string) => {
      if (["first", "previous"].includes(name) && currentPage === 1)
        return true;
      if (["next", "last"].includes(name) && currentPage === embeds.length)
        return true;
      return false;
    }
    let names = ["previous", "next"];
    if (fastSkip) names = ["first", ...names, "last"];
    if (pageTravel) names.push("number");
    return names.reduce((accumulator: MessageButton[], name) => {
      accumulator.push(
        new MessageButton()
          .setEmoji(getButtonData(name)?.emoji || defaultEmojis[name])
          .setCustomId(name)
          .setDisabled(state || checkState(name))
          .setStyle(getButtonData(name)?.style || defaultStyles[name])
      );
      return accumulator;
    }, []);
  }
  const components = (state: boolean) => [
    new MessageActionRow().addComponents(generateButtons(state)),
  ];
  const changeFooter = () => {
    const embed = embeds[currentPage - 1];
    const newEmbed = new MessageEmbed(embed);
    if (embed?.footer?.text) {
      return newEmbed.setFooter(
        `${embed.footer.text} - Page ${currentPage} of ${embeds.length}`,
        embed.footer.iconURL
      );
    }
    return newEmbed.setFooter(`Page ${currentPage} of ${embeds.length}`);
  }
  const initialMessage = await channel.send({
    embeds: [changeFooter()],
    components: components(false),
  });
  const defaultFilter = (interaction: any) => {
    if (!interaction.deferred) interaction.deferUpdate();
    return interaction.user.id === author.id;
  }
  const filter = customFilter || defaultFilter;
  const collectorOptions = () => {
    const opt: any = {
      filter,
      componentType: "BUTTON",
    }
    if (max) opt["max"] = max;
    if (time) opt["time"] = time;
    return opt;
  }
  const collector = channel.createMessageComponentCollector(collectorOptions());
  const pageTravelling = new Set();
  const numberTravel = async () => {
    if (pageTravelling.has(author.id))
      return channel.send("Type `end` to stop page travelling!");
    const collector = channel.createMessageCollector({
      filter: (msg) => msg.author.id === author.id,
      time: 30000,
    });
    const numberTravelMessage = await channel.send(
      `${author.tag}, you have 30 seconds, send numbers in chat to change pages! Simply type \`end\` to exit from page travelling.`
    );
    pageTravelling.add(author.id);
    collector.on("collect", (message) => {
      if (message.content.toLowerCase() === "end") {
        message.delete().catch(() => {});
        return collector.stop();
      }
      const int = parseInt(message.content);
      if (isNaN(int) || !(int < embeds.length) || !(int >= 1)) return;
      currentPage = int;
      initialMessage.edit({
        embeds: [changeFooter()],
        components: components(false),
      });
      if (message.guild?.me?.permissions.has("MANAGE_MESSAGES"))
        message.delete();
    });
    collector.on("end", () => {
      if (numberTravelMessage.deletable) numberTravelMessage.delete();
      pageTravelling.delete(author.id);
    });
  }
  collector.on("collect", async (interaction) => {
    const id = interaction.customId;
    if (id === "first") currentPage = 1;
    if (id === "previous") currentPage--;
    if (id === "next") currentPage++;
    if (id === "last") currentPage = embeds.length;
    if (id === "number") await numberTravel();
    initialMessage.edit({
      embeds: [changeFooter()],
      components: components(false),
    });
  });
  collector.on("end", () => {
    initialMessage.edit({
      components: components(true),
    });
  });
}

export default pagination;
