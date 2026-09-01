import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js';

export const category = "Utilitaire";

export const data = new SlashCommandBuilder()
  .setName('avatar')
  .setDescription('Affiche l\'avatar d\'un utilisateur')
  .addUserOption(option =>
    option.setName('utilisateur')
      .setDescription('L\'utilisateur dont vous voulez voir l\'avatar')
      .setRequired(false)
  );

export async function execute(interaction) {
  // Récupérer l'utilisateur mentionné ou l'utilisateur qui a lancé la commande
  const user = interaction.options.getUser('utilisateur') || interaction.user;

  // Construire un embed avec l'avatar
  const embed = new EmbedBuilder()
    .setTitle(`Avatar de ${user.tag}`)
    .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
    .setColor('#0099ff')
    .setTimestamp();

  await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
}
