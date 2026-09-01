import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

export const category = "Fun";

export const data = new SlashCommandBuilder()
  .setName('kiss')
  .setDescription('Envoie un bisou à quelqu’un')
  .addUserOption(option =>
    option.setName('membre')
      .setDescription('La personne à embrasser')
      .setRequired(true)
  );

const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

export async function execute(interaction) {
  const user = interaction.options.getUser('membre');

  let kissGifUrl = null;

  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=kiss&limit=25&rating=g`);
    const json = await response.json();

    if (json.data && json.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * json.data.length);
      kissGifUrl = json.data[randomIndex].images.original.url;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du GIF Giphy:', error);
  }

  if (!kissGifUrl) {
    kissGifUrl = 'https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif';
  }

  const embed = new EmbedBuilder()
    .setDescription(`${interaction.user} envoie un bisou à ${user} 😘`)
    .setImage(kissGifUrl)
    .setColor('#FFC0CB');

  await interaction.reply({ embeds: [embed] });
}
