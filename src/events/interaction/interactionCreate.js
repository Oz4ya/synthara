import { MessageFlags } from "discord.js";
import { isBlacklisted } from "../../utils/blacklistManager.js";

export const name = "interactionCreate";
export const once = false;

export async function execute(interaction, client) {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  // Vérification blacklist : on laisse toujours passer /blacklist
  // pour qu'un admin puisse retirer quelqu'un.
  if (interaction.commandName !== "blacklist") {
    const entry = isBlacklisted(interaction.user.id);
    if (entry) {
      return interaction.reply({
        content: `🚫 Tu es blacklisté et ne peux pas utiliser ce bot.\n**Raison :** ${entry.reason}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "❌ Une erreur est survenue.",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "❌ Une erreur est survenue.",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}
