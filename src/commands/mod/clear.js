import { SlashCommandBuilder, MessageFlags } from 'discord.js';

export const category = "Modération";

export const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Supprime un nombre de messages dans le canal')
  .addIntegerOption(option =>
    option.setName('nombre')
      .setDescription('Nombre de messages à supprimer (max 100)')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(100)
  );

export async function execute(interaction) {
  const amount = interaction.options.getInteger('nombre');

  // Vérifier les permissions
  if (!interaction.member.permissions.has('ManageMessages')) {
    return interaction.reply({ content: "Vous n'avez pas la permission de gérer les messages.", flags: MessageFlags.Ephemeral });
  }

  try {
    // Supprimer les messages
    const deletedMessages = await interaction.channel.bulkDelete(amount, true);
    await interaction.reply({ content: `✅ ${deletedMessages.size} message(s) supprimé(s).`, flags: MessageFlags.Ephemeral });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "Erreur lors de la suppression des messages.", flags: MessageFlags.Ephemeral });
  }
}
