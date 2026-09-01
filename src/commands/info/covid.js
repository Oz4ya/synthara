import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js';
import fetch from 'node-fetch';

export const category = "Informations";

export const data = new SlashCommandBuilder()
  .setName('covid')
  .setDescription('Affiche les statistiques COVID pour un pays donné')
  .addStringOption(option =>
    option.setName('pays')
      .setDescription('Nom du pays')
      .setRequired(true)
  );

export async function execute(interaction) {
  const country = interaction.options.getString('pays');

  try {
    const response = await fetch(`https://disease.sh/v3/covid-19/countries/${encodeURIComponent(country)}?strict=true`);

    if (!response.ok) {
      return interaction.reply({ content: `Impossible de trouver les données COVID pour : ${country}`, flags: MessageFlags.Ephemeral });
    }

    const data = await response.json();

    const embed = new EmbedBuilder()
      .setTitle(`Statistiques COVID-19 pour ${data.country}`)
      .setThumbnail(data.countryInfo.flag)
      .addFields(
        { name: 'Cas confirmés', value: data.cases.toLocaleString(), inline: true },
        { name: 'Cas actifs', value: data.active.toLocaleString(), inline: true },
        { name: 'Guérisons', value: data.recovered.toLocaleString(), inline: true },
        { name: 'Décès', value: data.deaths.toLocaleString(), inline: true },
        { name: 'Tests réalisés', value: data.tests.toLocaleString(), inline: true }
      )
      .setColor('#FF0000')
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Erreur lors de la récupération des données COVID.', flags: MessageFlags.Ephemeral });
  }
}
