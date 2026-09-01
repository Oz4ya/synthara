import Discord from "discord.js";
import { kazagumo } from "../../music/kazagumo.js";

const { SlashCommandBuilder } = Discord;

export const category = "Music";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Joue une musique")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("Lien ou nom de la musique")
      .setRequired(true),
  );

export async function execute(interaction) {
  const query = interaction.options.getString("query");

  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    return interaction.reply({
      content: "❌ Tu dois être dans un salon vocal",
      ephemeral: true,
    });
  }

  await interaction.deferReply();

  try {
    const result = await kazagumo.search(query, {
      requester: interaction.user,
    });

    if (!result.tracks.length) {
      return interaction.editReply("❌ Aucun résultat trouvé");
    }

    const player = await kazagumo.createPlayer({
      guildId: interaction.guild.id,
      voiceId: voiceChannel.id,
      textId: interaction.channel.id,
      volume: 50,
      deaf: true,
    });

    player.queue.add(result.tracks[0]);

    if (!player.playing) {
      player.play();
    }

    await interaction.editReply(`🎵 Ajouté : **${result.tracks[0].title}**`);
  } catch (error) {
    console.error(error);

    await interaction.editReply("❌ Erreur pendant la lecture");
  }
}
