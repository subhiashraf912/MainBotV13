import chalk from "chalk";
import { MessageSelectMenu, MessageActionRow } from "discord.js";
type menuType = {
  label: string;
  description: string;
  value: string;
};
const create_mh = (array: Array<string>) => {
  if (!array)
    throw new Error(
      chalk.red.bold(
        `The options were not provided! Make sure you provide all the options!`
      )
    );
  if (array.length < 0)
    throw new Error(
      chalk.red.bold(`The array has to have atleast one thing to select!`)
    );
  let select_menu;

  let id = `help-menus`;

  let menus: menuType[] = [];

  const emo = {
    fun: ":video_game:",
    ticket: ":ticket:",
    utility: ":gear:",
    moderation: ":tools:",
  };

  // now lets run it
  array.forEach((cca) => {
    let name = cca;
    let sName = `${name.toUpperCase()}`;
    let tName = name.toLowerCase();
    let fName = name.toUpperCase();

    return menus.push({
      label: sName,
      description: `${tName} commands!`,
      value: fName,
    });
  });

  let chicken = new MessageSelectMenu()
    .setCustomId(id)
    .setPlaceholder(`Choose the command category`)
    .addOptions(menus);

  select_menu = new MessageActionRow().addComponents(chicken);

  return {
    smenu: [select_menu],
    sid: id,
  };
};

export default create_mh;
