import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export const category = "Fun";

export const data = new SlashCommandBuilder()
  .setName('slap')
  .setDescription('Donne une tape à quelqu’un')
  .addUserOption(option =>
    option.setName('membre')
      .setDescription('La personne à taper')
      .setRequired(true)
  );

const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

export async function execute(interaction) {
  const user = interaction.options.getUser('membre');

  let slapGifUrl = null;

  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=slap&limit=25&rating=g`);
    const json = await response.json();

    if (json.data && json.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * json.data.length);
      slapGifUrl = json.data[randomIndex].images.original.url;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du GIF Giphy:', error);
  }

  if (!slapGifUrl) {
    slapGifUrl = 'https://media.giphy.com/media/jLeyZWgtwgr2U/giphy.gif'; // GIF fallback
  }

  const embed = new EmbedBuilder()
    .setDescription(`${interaction.user} donne une tape à ${user} 👋`)
    .setImage(slapGifUrl)
    .setColor('#FFC0CB');

  await interaction.reply({ embeds: [embed] });
}

