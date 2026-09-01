import Discord from 'discord.js';
import os from 'os';

const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = Discord;

export const category = "Développeur";

export const data = new SlashCommandBuilder()
  .setName('debug')
  .setDescription('Affiche des informations détaillées pour le débogage');

export async function execute(interaction) {
  const client = interaction.client;

  // Restrict usage to bot owner(s)
  const developerIds = ['1483261014593110027']; // Remplacez par votre ID
  if (!developerIds.includes(interaction.user.id)) {
    return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", flags: MessageFlags.Ephemeral });
  }

  const memoryUsageMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  const uptimeSeconds = Math.floor(client.uptime / 1000);
  const cpuUsage = process.cpuUsage();
  const platform = os.platform();
  const arch = os.arch();
  const nodeVersion = process.version;

  const embed = new EmbedBuilder()
    .setTitle('🛠️ Debug Info')
    .setColor('#FF0000')
    .addFields(
      { name: 'Uptime', value: `${uptimeSeconds} secondes`, inline: true },
      { name: 'Mémoire utilisée', value: `${memoryUsageMB} MB`, inline: true },
      { name: 'CPU Usage', value: `User: ${cpuUsage.user} System: ${cpuUsage.system}`, inline: true },
      { name: 'Plateforme', value: platform, inline: true },
      { name: 'Architecture', value: arch, inline: true },
      { name: 'Node.js Version', value: nodeVersion, inline: true },
      { name: 'Serveurs', value: `${client.guilds.cache.size}`, inline: true },
      { name: 'Utilisateurs', value: `${client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)}`, inline: true },
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
}
