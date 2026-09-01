import Discord from 'discord.js';

const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = Discord;

export const category = "Divers";

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Affiche les statistiques détaillées du bot');

export async function execute(interaction) {
  const client = interaction.client;
  const wsLatency = client.ws.ping;

  const pingEmbed = new EmbedBuilder()
    .setColor('#5865F2')
    .addFields(
      { name: '🌐 Latence WS', value: `\`${wsLatency}ms\``, inline: true }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [pingEmbed], flags: MessageFlags.Ephemeral });
}
