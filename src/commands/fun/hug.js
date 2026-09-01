import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch'; // ou 'undici'

export const category = "Fun";

export const data = new SlashCommandBuilder()
  .setName('hug')
  .setDescription('Fait un câlin à quelqu’un')
  .addUserOption(option =>
    option.setName('membre')
      .setDescription('La personne à câliner')
      .setRequired(true)
  );

const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

export async function execute(interaction) {
  const user = interaction.options.getUser('membre');

  let hugGifUrl = null;

  try {
    // Requête à l'API Giphy pour un GIF "hug" aléatoire
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=hug&limit=25&rating=g`);
    const json = await response.json();

    if (json.data && json.data.length > 0) {
      // Choisir un GIF aléatoire parmi les résultats
      const randomIndex = Math.floor(Math.random() * json.data.length);
      hugGifUrl = json.data[randomIndex].images.original.url;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du GIF Giphy:', error);
  }

  // Fallback si pas de GIF trouvé
  if (!hugGifUrl) {
    hugGifUrl = 'https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif';
  }

  const embed = new EmbedBuilder()
    .setDescription(`${interaction.user} fait un gros câlin à ${user} 🤗`)
    .setImage(hugGifUrl)
    .setColor('#FFC0CB');

  await interaction.reply({ embeds: [embed] });
}
