import { SlashCommandBuilder, PermissionsBitField } from "discord.js";

export const category = "Modération";

export const data = new SlashCommandBuilder()
  .setName("ban")
  .setDescription("Bannir un membre du serveur")
  .addUserOption((option) =>
    option
      .setName("membre")
      .setDescription("Le membre à bannir")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("raison").setDescription("Raison du ban").setRequired(false)
  );

export async function execute(interaction) {
  if (
    !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
  ) {
    return interaction.reply({
      content: "Tu n'as pas la permission de bannir des membres !",
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

  if (!member.bannable) {
    return interaction.reply({
      content: "Je ne peux pas bannir ce membre !",
      flags: MessageFlags.Ephemeral,
    });
  }

  const reason =
    interaction.options.getString("raison") || "Aucune raison fournie";

  try {
    await member.ban({ reason });
    await interaction.reply(
      `${member.user.tag} a été banni ! Raison : ${reason}`
    );
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Une erreur est survenue lors du ban.",
      flags: MessageFlags.Ephemeral,
    });
  }
}
