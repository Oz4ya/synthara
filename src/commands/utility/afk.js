import { SlashCommandBuilder, MessageFlags } from 'discord.js';

export const category = "Utilitaire";

// Stockage simple en mémoire (à remplacer par une base de données pour persistance)
const afkUsers = new Map();

export const data = new SlashCommandBuilder()
  .setName('afk')
  .setDescription('Indique que vous êtes AFK avec un message')
  .addStringOption(option =>
    option.setName('message')
      .setDescription('Message indiquant la raison de votre absence')
      .setRequired(false)
  );

export async function execute(interaction) {
  const userId = interaction.user.id;
  const message = interaction.options.getString('message') || 'AFK';

  afkUsers.set(userId, {
    message,
    timestamp: Date.now()
  });

  await interaction.reply({ content: `✅ Vous êtes maintenant AFK : ${message}`, flags: MessageFlags.Ephemeral });
}

// Fonction à appeler dans votre gestionnaire d'événements messageCreate pour notifier si un utilisateur est AFK
export function checkAfk(interaction) {
  const mentionedUsers = interaction.mentions.users;
  if (!mentionedUsers) return;

  mentionedUsers.forEach(user => {
    if (afkUsers.has(user.id)) {
      const afkInfo = afkUsers.get(user.id);
      const duration = Math.floor((Date.now() - afkInfo.timestamp) / 60000); // en minutes
      interaction.channel.send(`${user.tag} est AFK : ${afkInfo.message} (depuis ${duration} minute(s))`);
    }
  });

  // Si l’auteur du message était AFK, on peut le retirer de la liste
  if (afkUsers.has(interaction.author.id)) {
    afkUsers.delete(interaction.author.id);
    interaction.channel.send(`${interaction.author.tag}, votre statut AFK a été retiré.`);
  }
}