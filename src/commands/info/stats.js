import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const category = "Informations";

export const data = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('Affiche des statistiques du serveur');

export async function execute(interaction) {
  const guild = interaction.guild;

  const embed = new EmbedBuilder()
    .setTitle(`Statistiques du serveur ${guild.name}`)
    .addFields(
      { name: 'Membres', value: `${guild.memberCount}`, inline: true },
      { name: 'Salons', value: `${guild.channels.cache.size}`, inline: true },
      { name: 'Rôles', value: `${guild.roles.cache.size}`, inline: true }
    )
    .setColor('#7289DA')
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
