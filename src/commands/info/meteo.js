import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js';
import fetch from 'node-fetch';

export const category = "Informations";

export const data = new SlashCommandBuilder()
  .setName('meteo')
  .setDescription('Affiche la météo actuelle pour une ville donnée')
  .addStringOption(option =>
    option.setName('ville')
      .setDescription('Nom de la ville')
      .setRequired(true)
  );

// Remplacez par votre clé API OpenWeatherMap (gratuite)
const OPENWEATHER_API_KEY = 'e9ca57485b31af8248639ad2e6cb85a9';

export async function execute(interaction) {
  const ville = interaction.options.getString('ville');

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ville)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return interaction.reply({
          content: `❌ Ville introuvable : "${ville}". Veuillez vérifier le nom et réessayer.`,
          flags: MessageFlags.Ephemeral
        });
      } else {
        return interaction.reply({
          content: `❌ Impossible de récupérer la météo pour "${ville}". Code erreur : ${response.status}`,
          flags: MessageFlags.Ephemeral
        });
      }
    }

    const data = await response.json();

    const description = data.weather[0].description;
    const temperature = data.main.temp.toFixed(1);
    const ressenti = data.main.feels_like.toFixed(1);
    const humidite = data.main.humidity;
    const pression = data.main.pressure;
    const ventMs = data.wind.speed;
    const ventKmH = (ventMs * 3.6).toFixed(1); 

    const embed = new EmbedBuilder()
      .setTitle(`Météo à ${data.name}, ${data.sys.country}`)
      .setDescription(description.charAt(0).toUpperCase() + description.slice(1))
      .addFields(
        { name: '🌡️ Température', value: `${temperature} °C`, inline: true },
        { name: '🤔 Ressenti', value: `${ressenti} °C`, inline: true },
        { name: '💧 Humidité', value: `${humidite} %`, inline: true },
        { name: '🌬️ Vent', value: `${ventKmH} km/h (${ventMs} m/s)`, inline: true },
        { name: '📊 Pression', value: `${pression} hPa`, inline: true }
      )
      .setColor('#1E90FF')
      .setTimestamp()
      .setFooter({ text: 'Données fournies par OpenWeatherMap' });

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });

  } catch (error) {
    console.error('Erreur météo:', error);
    await interaction.reply({
      content: '❌ Une erreur est survenue lors de la récupération des données météo. Veuillez réessayer plus tard.',
      flags: MessageFlags.Ephemeral
    });
  }
}


