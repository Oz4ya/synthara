import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export const category = "Fun";

export const data = new SlashCommandBuilder()
  .setName('wave')
  .setDescription('Fait un signe de la main à quelqu’un')
  .addUserOption(option =>
    option.setName('membre')
      .setDescription('La personne à saluer')
      .setRequired(true)
  );

const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

export async function execute(interaction) {
  const user = interaction.options.getUser('membre');

  let waveGifUrl = null;

  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=wave&limit=25&rating=g`);
    const json = await response.json();

    if (json.data && json.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * json.data.length);
      waveGifUrl = json.data[randomIndex].images.original.url;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du GIF Giphy:', error);
  }

  if (!waveGifUrl) {
    waveGifUrl = 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif'; // fallback
  }

  const embed = new EmbedBuilder()
    .setDescription(`${interaction.user} fait un signe de la main à ${user} 👋`)
    .setImage(waveGifUrl)
    .setColor('#FFC0CB');

  await interaction.reply({ embeds: [embed] });
}
