import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js';

export const category = "Informations";

export const data = new SlashCommandBuilder()
  .setName('serverinfo')
  .setDescription('Affiche les informations du serveur');

export async function execute(interaction) {
  const guild = interaction.guild;

  if (!guild) {
    return interaction.reply({ content: "Cette commande doit être utilisée dans un serveur.", flags: MessageFlags.Ephemeral });
  }

  // Récupération des informations clés
  const owner = await guild.fetchOwner();
  const memberCount = guild.memberCount;
  const roleCount = guild.roles.cache.size;
  const channelCount = guild.channels.cache.size;
  const createdAt = guild.createdAt.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  const embed = new EmbedBuilder()
    .setTitle(`Informations sur le serveur : ${guild.name}`)
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .addFields(
      { name: 'Propriétaire', value: `${owner.user.tag}`, inline: true },
      { name: 'ID du serveur', value: guild.id, inline: true },
      { name: 'Nombre de membres', value: `${memberCount}`, inline: true },
      { name: 'Nombre de rôles', value: `${roleCount}`, inline: true },
      { name: 'Nombre de salons', value: `${channelCount}`, inline: true },
      { name: 'Date de création', value: createdAt, inline: true }
    )
    .setColor('#0099ff')
    .setTimestamp();

  await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
}
