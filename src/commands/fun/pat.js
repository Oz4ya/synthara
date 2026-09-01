import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export const category = "Fun";

export const data = new SlashCommandBuilder()
  .setName('pat')
  .setDescription('donner une petite tape amicale dans le dos à quelqu\'un')
  .addUserOption(option =>
    option.setName('membre')
      .setDescription('La personne à tapoter virtuellement')
      .setRequired(true)
  );

const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

export async function execute(interaction) {
  const user = interaction.options.getUser('membre');

  let patGifUrl = null;

  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=pat&limit=25&rating=g`);
    const json = await response.json();

    if (json.data && json.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * json.data.length);
      patGifUrl = json.data[randomIndex].images.original.url;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du GIF Giphy:', error);
  }

  if (!patGifUrl) {
    patGifUrl = 'https://media.giphy.com/media/4HP0ddZnNVvKU/giphy.gif'; 
  }

  const embed = new EmbedBuilder()
    .setDescription(`${interaction.user} donne une petite tape amicale dans le dos à ${user} 🤗`)
    .setImage(patGifUrl)
    .setColor('#FFC0CB');

  await interaction.reply({ embeds: [embed] });
}
