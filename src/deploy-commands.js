import "dotenv/config";
import fs from "fs";
import path from "path";
import { REST, Routes } from "discord.js";
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

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = getFilesRecursively(commandsPath);

for (const file of commandFiles) {
  const command = await import(pathToFileURL(file).href);
  if (command.data && typeof command.data.toJSON === "function") {
    commands.push(command.data.toJSON());
    console.log(`Commande prête à être déployée : ${command.data.name}`);
  } else {
    console.warn(
      `Le fichier ${file} ne contient pas de propriété 'data' valide.`,
    );
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`🔄 Déploiement de ${commands.length} commandes...`);

    // Déploiement global uniquement
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });
    console.log("✅ Commandes déployées globalement");
  } catch (error) {
    console.error("Erreur lors du déploiement des commandes :", error);
  }
})();