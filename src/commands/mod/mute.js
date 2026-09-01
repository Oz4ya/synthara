import { SlashCommandBuilder, PermissionsBitField } from "discord.js";

export const category = "Modération";

export const data = new SlashCommandBuilder()
  .setName("mute")
  .setDescription("Mute un membre du serveur")
  .addUserOption((option) =>
    option
      .setName("membre")
      .setDescription("Le membre à mute")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("raison").setDescription("Raison du mute").setRequired(false)
  )
  .addIntegerOption((option) =>
    option
      .setName("durée")
      .setDescription("Durée du mute en minutes (laisser vide pour permanent)")
      .setRequired(false)
  );

export async function execute(interaction) {
  if (
    !interaction.member.permissions.has(
      PermissionsBitField.Flags.ModerateMembers
    )
  ) {
    return interaction.reply({
      content: "Tu n'as pas la permission de mute des membres !",
      flags: MessageFlags.Ephemeral,
    });
  }

  const member = interaction.options.getMember("membre");
  if (!member) {
    return interaction.reply({
      content: "Membre introuvable !",
      flags: MessageFlags.Ephemeral,
    });
  }

  const reason =
    interaction.options.getString("raison") || "Aucune raison fournie";
  const duration = interaction.options.getInteger("durée");

  let muteRole = interaction.guild.roles.cache.find(
    (r) => r.name.toLowerCase() === "muted"
  );

  if (!muteRole) {
    try {
      muteRole = await interaction.guild.roles.create({
        name: "Muted",
        colors: { value: "GREY" },
        permissions: [],
        reason: "Création automatique du rôle Muted",
      });

      interaction.guild.channels.cache.forEach(async (channel) => {
        try {
          await channel.permissionOverwrites.edit(muteRole, {
            SendMessages: false,
            Speak: false,
            AddReactions: false,
          });
        } catch (err) {
          console.warn(
            `Impossible de configurer le canal ${channel.name} pour Muted`,
            err
          );
        }
      });
    } catch (error) {
      console.error("Erreur lors de la création du rôle Muted :", error);
      return interaction.reply({
        content:
          "Impossible de créer le rôle 'Muted'. Vérifie mes permissions.",
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  if (member.roles.cache.has(muteRole.id)) {
    return interaction.reply({
      content: "Ce membre est déjà mute !",
      flags: MessageFlags.Ephemeral,
    });
  }

  try {
    await member.roles.add(muteRole, reason);

    let replyMessage = `${member.user.tag} a été mute ! Raison : ${reason}`;
    if (duration) replyMessage += ` Durée : ${duration} minute(s)`;

    await interaction.reply({
      content: replyMessage,
      flags: MessageFlags.Ephemeral,
    });

    if (duration) {
      setTimeout(async () => {
        if (member.roles.cache.has(muteRole.id)) {
          try {
            await member.roles.remove(muteRole, "Fin du mute temporaire");
            console.log(
              `${member.user.tag} a été unmute automatiquement après ${duration} minute(s).`
            );
          } catch (error) {
            console.error(
              `Impossible de retirer le rôle Muted à ${member.user.tag}:`,
              error
            );
          }
        }
      }, duration * 60 * 1000);
    }
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Une erreur est survenue lors du mute.",
      flags: MessageFlags.Ephemeral,
    });
  }
}
