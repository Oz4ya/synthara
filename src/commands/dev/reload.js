import Discord from 'discord.js';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const { SlashCommandBuilder, MessageFlags } = Discord;

export const category = "Développeur";

export const data = new SlashCommandBuilder()
  .setName('reload')
  .setDescription('Recharge une commande du bot')
  .addStringOption(option =>
    option.setName('command')
      .setDescription('Chemin relatif de la commande à recharger (ex: misc/ping)')
      .setRequired(true)
  );

export async function execute(interaction) {
  const client = interaction.client;
  const commandPathInput = interaction.options.getString('command').toLowerCase();

  // Restrict usage to bot owner(s)
  const developerIds = ['1483261014593110027']; // Remplacez par votre ID
  if (!developerIds.includes(interaction.user.id)) {
    return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", flags: MessageFlags.Ephemeral });
  }

  // Extraire le nom de la commande (le dernier segment du chemin)
  const commandName = commandPathInput.split('/').pop();

  if (!client.commands.has(commandName)) {
    return interaction.reply({ content: `La commande \`${commandName}\` n'existe pas.`, flags: MessageFlags.Ephemeral });
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const commandsPath = path.join(__dirname, '..', '..', 'commands');

  // Construire le chemin complet vers le fichier de commande
  const commandFullPath = path.join(commandsPath, `${commandPathInput}.js`);
  console.log('Chemin du fichier à recharger:', commandFullPath);

  const commandUrl = pathToFileURL(commandFullPath).href;

  try {
    // Import dynamique avec cache busting
    const newCommand = await import(`${commandUrl}?update=${Date.now()}`);

    // Mettre à jour la commande dans la collection
    client.commands.set(newCommand.data.name, newCommand);

    await interaction.reply({ content: `Commande \`${commandName}\` rechargée avec succès !`, flags: MessageFlags.Ephemeral });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: `Erreur lors du rechargement de la commande \`${commandName}\` :\n\`${error.message}\``, flags: MessageFlags.Ephemeral });
  }
}
