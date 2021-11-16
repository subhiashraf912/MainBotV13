import path from "path";
import { promises as fs } from "fs";
import DiscordClient from "../client/client";
import { ApplicationCommandData } from "discord.js";

export async function registerCommands(
  client: DiscordClient,
  dir: string = ""
) {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerCommands(client, path.join(dir, file));
    if (file.endsWith(".js") || file.endsWith(".ts")) {
      const { default: Command } = await import(path.join(dir, file));
      const command = new Command();
      client.commands.set(command.getName(), command);
      command.getAliases().forEach((alias: string) => {
        client.aliases.set(alias, command.getName());
      });
    }
  }
}
export async function registerEvents(client: DiscordClient, dir: string = "") {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerEvents(client, path.join(dir, file));
    if (file.endsWith(".js") || file.endsWith(".ts")) {
      const { default: Event } = await import(path.join(dir, file));
      const event = new Event();
      client.events.set(event.getName(), event);
      client.on(event.getName(), event.run.bind(event, client));
    }
  }
}

// export async function registerYoutubeEvents(client: DiscordClient, dir: string = "") {
//   const filePath = path.join(__dirname, dir);
//   const files = await fs.readdir(filePath);
//   for (const file of files) {
//     const stat = await fs.lstat(path.join(filePath, file));
//     if (stat.isDirectory()) registerEvents(client, path.join(dir, file));
//     if (file.endsWith(".js") || file.endsWith(".ts")) {
//       const { default: Event } = await import(path.join(dir, file));
//       const event = new Event();
//       client.youtubeEvents.set(event.getName(), event);
//       client.YoutubeNotifications.on(event.getName(), event.run.bind(event, client));
//     }
//   }
// }

export async function registerDistubeEvents(
  client: DiscordClient,
  dir: string = ""
) {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerEvents(client, path.join(dir, file));
    if (file.endsWith(".js") || file.endsWith(".ts")) {
      const { default: Event } = await import(path.join(dir, file));
      const event = new Event();
      client.distubeEvents.set(event.getName(), event);
      if (client.distube) {
        client.distube.on(event.getName(), event.run.bind(event, client));
      }
    }
  }
}

export async function registerSlashCommands(
  client: DiscordClient,
  dir: string = ""
) {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  const slashCommandsArray: ApplicationCommandData[] = [];
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerCommands(client, path.join(dir, file));
    if (file.endsWith(".js") || file.endsWith(".ts")) {
      const { default: Command } = await import(path.join(dir, file));
      const command = new Command();
      client.slashCommands.set(command.getName(), command);
      slashCommandsArray.push({
        name: command.getName(),
        description: command.getDescription(),
        options: command.getOptions(),
      });
    }
  }
  client.on("ready", (c) => {
    client.application?.commands.set(slashCommandsArray);
  });
}

export async function registerGetRoutes(
  client: DiscordClient,
  dir: string = ""
) {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerGetRoutes(client, path.join(dir, file));
    if (file.endsWith(".js") || file.endsWith(".ts")) {
      const { default: Route } = await import(path.join(dir, file));
      Route(client.Express, client);
    }
  }
}
