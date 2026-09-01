import { client } from "./bot.js";
import "dotenv/config";

import { Collection } from "discord.js";

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getFilesRecursively(dir) {
  let results = [];

  const list = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of list) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory())
      results = results.concat(getFilesRecursively(fullPath));
    else if (file.name.endsWith(".js")) results.push(fullPath);
  }

  return results;
}

// COMMANDES

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");

const commandFiles = getFilesRecursively(commandsPath);

for (const file of commandFiles) {
  const command = await import(pathToFileURL(file).href);

  client.commands.set(command.data.name, command);
}

// EVENTS DISCORD

const eventsPath = path.join(__dirname, "events");

const eventFiles = getFilesRecursively(eventsPath);

for (const file of eventFiles) {
  const event = await import(pathToFileURL(file).href);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// READY → LAVALINK

import { initKazagumo, setClient } from "./music/kazagumo.js";

client.once("clientReady", () => {
  setClient(client);
  initKazagumo();

  console.log(`🤖 Connecté ${client.user.tag}`);
});

// LOGIN

client.login(process.env.TOKEN);

import "./server.js";
