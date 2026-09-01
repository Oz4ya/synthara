import { SlashCommandBuilder, MessageFlags, EmbedBuilder } from "discord.js";

export const category = "Modération";

export const data = new SlashCommandBuilder()
  .setName("bans")
  .setDescription("Utilisez les commandes de bans")
  .addSubcommand((sub) =>
    sub.setName("list").setDescription("Liste les membres bannis du serveur"),
  )
  .addSubcommand((sub) =>
    sub
      .setName("check")
      .setDescription("Vérifie si un utilisateur est banni")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("Utilisateur à vérifier")
          .setRequired(true),
      ),
  );
export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand === "list") {
    try {
      const bans = await interaction.guild.bans.fetch();
      if (bans.size === 0) {
        return interaction.reply({
          content: "Aucun membre banni sur ce serveur.",
          flags: MessageFlags.Ephemeral,
        });
      }

      const embed = new EmbedBuilder()
        .setTitle("Liste des membres bannis")
        .setDescription(
          bans
            .map(
              (ban) =>
                `${ban.user.tag} - Raison : ${ban.reason || "Non spécifiée"}`,
            )
            .join("\n"),
        )
        .setColor("#ff0000")
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Erreur lors de la récupération des bans.",
        flags: MessageFlags.Ephemeral,
      });
    }
  } else if (subcommand === "check") {
    const user = interaction.options.getUser("user");

    try {
      const ban = await interaction.guild.bans.fetch(user.id);
      if (ban) {
        await interaction.reply({
          content: `${user.tag} est banni du serveur. Raison : ${ban.reason || "Non spécifiée"}`,
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch {
      await interaction.reply({
        content: `${user.tag} n'est pas banni du serveur.`,
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}
