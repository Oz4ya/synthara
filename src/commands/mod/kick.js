import { SlashCommandBuilder } from 'discord.js';

export const category = "Modération";

export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Kick un membre du serveur')
  .addUserOption(option =>
    option.setName('membre')
      .setDescription('Membre à kicker')
      .setRequired(true)
  );

export async function execute(interaction) {
  const member = interaction.options.getMember('membre');
  if (!member) return interaction.reply({ content: 'Membre non trouvé', flags: MessageFlags.Ephemeral });
  try {
    await member.kick();
    await interaction.reply(`${member.user.tag} a été kick.`);
  } catch (err) {
    await interaction.reply({ content: 'Impossible de kick ce membre.', flags: MessageFlags.Ephemeral });
  }
}
