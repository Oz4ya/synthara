import Discord from 'discord.js';
const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = Discord;

export const category = "Utilitaire";

export const data = new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('Affiche les informations d\'un utilisateur')
  .addUserOption(option =>
    option.setName('utilisateur')
      .setDescription('L\'utilisateur à afficher')
      .setRequired(false)
  );

export async function execute(interaction) {
  const user = interaction.options.getUser('utilisateur') || interaction.user;
  const member = interaction.guild.members.cache.get(user.id);

  const embed = new EmbedBuilder()
    .setTitle(`Informations sur ${user.tag}`)
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: 'ID', value: user.id, inline: true },
      { name: 'Pseudo serveur', value: member ? member.displayName : 'N/A', inline: true },
      { name: 'Compte créé le', value: user.createdAt.toLocaleDateString(), inline: true },
      { name: 'Rejoint le serveur', value: member ? member.joinedAt.toLocaleDateString() : 'N/A', inline: true },
      { name: 'Rôles', value: member ? member.roles.cache.map(r => r.name).join(', ') : 'N/A' }
    )
    .setColor('#0099ff');

  await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
}
