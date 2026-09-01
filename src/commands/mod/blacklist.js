import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } from "discord.js";
import * as blacklistManager from "../../utils/blacklistManager.js";

// ID(s) des personnes autorisées à gérer la blacklist en plus des admins (optionnel)
const OWNER_IDS = ["TON_ID_DISCORD_ICI"];

export const data = new SlashCommandBuilder()
  .setName("blacklist")
  .setDescription("Gère la liste noire du bot")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand((sub) =>
    sub
      .setName("add")
      .setDescription("Ajoute un utilisateur à la blacklist")
      .addUserOption((opt) =>
        opt.setName("utilisateur").setDescription("Utilisateur à blacklister").setRequired(true)
      )
      .addStringOption((opt) =>
        opt.setName("raison").setDescription("Raison du blacklist").setRequired(false)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("remove")
      .setDescription("Retire un utilisateur de la blacklist")
      .addUserOption((opt) =>
        opt.setName("utilisateur").setDescription("Utilisateur à retirer").setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub.setName("list").setDescription("Affiche tous les utilisateurs blacklistés")
  )
  .addSubcommand((sub) =>
    sub
      .setName("check")
      .setDescription("Vérifie si un utilisateur est blacklisté")
      .addUserOption((opt) =>
        opt.setName("utilisateur").setDescription("Utilisateur à vérifier").setRequired(true)
      )
  );

export async function execute(interaction) {
  const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.Administrator);
  const isOwner = OWNER_IDS.includes(interaction.user.id);

  if (!isAdmin && !isOwner) {
    return interaction.reply({
      content: "❌ Tu n'as pas la permission d'utiliser cette commande.",
      flags: MessageFlags.Ephemeral,
    });
  }

  const sub = interaction.options.getSubcommand();

  if (sub === "add") {
    const user = interaction.options.getUser("utilisateur");
    const reason = interaction.options.getString("raison") ?? "Aucune raison fournie";

    if (user.id === interaction.user.id) {
      return interaction.reply({
        content: "❌ Tu ne peux pas te blacklister toi-même.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const added = blacklistManager.addUser(user.id, reason);
    if (!added) {
      return interaction.reply({
        content: `⚠️ **${user.tag}** est déjà blacklisté.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle("🚫 Utilisateur blacklisté")
      .addFields(
        { name: "Utilisateur", value: `${user.tag} (${user.id})` },
        { name: "Raison", value: reason }
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }

  if (sub === "remove") {
    const user = interaction.options.getUser("utilisateur");
    const removed = blacklistManager.removeUser(user.id);

    if (!removed) {
      return interaction.reply({
        content: `⚠️ **${user.tag}** n'est pas dans la blacklist.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    return interaction.reply({ content: `✅ **${user.tag}** a été retiré de la blacklist.` });
  }

  if (sub === "list") {
    const users = blacklistManager.getAll();

    if (users.length === 0) {
      return interaction.reply({ content: "✅ Aucun utilisateur blacklisté actuellement." });
    }

    const description = users
      .map((u, i) => `**${i + 1}.** <@${u.id}> — *${u.reason}*`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle("📋 Liste des utilisateurs blacklistés")
      .setDescription(description)
      .setFooter({ text: `Total : ${users.length}` });

    return interaction.reply({ embeds: [embed] });
  }

  if (sub === "check") {
    const user = interaction.options.getUser("utilisateur");
    const entry = blacklistManager.isBlacklisted(user.id);

    if (!entry) {
      return interaction.reply({ content: `✅ **${user.tag}** n'est pas blacklisté.` });
    }

    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle("🚫 Utilisateur blacklisté")
      .addFields(
        { name: "Utilisateur", value: `${user.tag} (${user.id})` },
        { name: "Raison", value: entry.reason },
        { name: "Date", value: new Date(entry.date).toLocaleString("fr-FR") }
      );

    return interaction.reply({ embeds: [embed] });
  }
}
