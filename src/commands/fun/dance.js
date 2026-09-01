import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export const category = "Fun";

export const data = new SlashCommandBuilder()
  .setName('dance')
  .setDescription('Se met à danser')
  .addUserOption(option =>
    option.setName('membre')
      .setDescription('La personne avec qui danser (optionnel)')
      .setRequired(false)
  );

const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

export async function execute(interaction) {
  const user = interaction.options.getUser('membre');

  let danceGifUrl = null;

  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=dance&limit=25&rating=g`);
    const json = await response.json();

    if (json.data && json.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * json.data.length);
      danceGifUrl = json.data[randomIndex].images.original.url;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du GIF Giphy:', error);
  }

  if (!danceGifUrl) {
    danceGifUrl = 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'; // fallback
  }

  const description = user
    ? `${interaction.user} danse avec ${user} 💃🕺`
    : `${interaction.user} se met à danser 💃🕺`;

  const embed = new EmbedBuilder()
    .setDescription(description)
    .setImage(danceGifUrl)
    .setColor('#FFC0CB');

  await interaction.reply({ embeds: [embed] });
}
