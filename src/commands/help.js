import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";

export const category = "Utilitaire";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Affiche la liste des commandes ou recherche une commande")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("Nom ou mot-clé de la commande")
      .setRequired(false),
  );

export async function execute(interaction) {
  const query = interaction.options.getString("query")?.toLowerCase();
  const commands = interaction.client.commands;

  let filteredCommands = [...commands.values()];

  // 🔍 Recherche
  if (query) {
    filteredCommands = filteredCommands.filter(
      (cmd) =>
        cmd.data.name.toLowerCase().includes(query) ||
        cmd.data.description?.toLowerCase().includes(query),
    );
  }

  // ❌ Aucun résultat
  if (filteredCommands.length === 0) {
    return interaction.reply({
      content: `❌ Aucune commande trouvée pour **"${query}"**`,
      flags: MessageFlags.Ephemeral,
    });
  }

  // Regroupement par catégorie
  const categories = {};

  for (const command of filteredCommands) {
    const cat = command.category ?? "Autres";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(command);
  }

  // Tri catégories A → Z
  const sortedCategories = Object.keys(categories).sort((a, b) =>
    a.localeCompare(b, "fr"),
  );

  // Table des emojis par catégorie
  const categoryEmojis = {
    Développeur: "👨‍💻",
    Divers: "🌐",
    Information: "ℹ️",
    Utilitaire: "🛠️",
    Modération: "🛡️",
    Fun: "🎉",
    Misc: "🧰",
    Autres: "📂",
  };

  const embed = new EmbedBuilder()
    .setTitle(
      query ? `🔍 Résultats pour "${query}"` : "📖 Commandes de Synthara",
    )
    .setDescription(
      query
        ? "Commandes correspondant à votre recherche :"
        : "Voici les commandes disponibles par catégorie :",
    )
    .setColor(0xe63946)
    .setFooter({
      text: `Demandé par ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTimestamp();

  for (const category of sortedCategories) {
    // Tri commandes A → Z
    const sortedCommands = categories[category].sort((a, b) =>
      a.data.name.localeCompare(b.data.name, "fr"),
    );

    const emoji = categoryEmojis[category] || "📂";

    embed.addFields({
      name: `${emoji} ${category}`,
      value: sortedCommands
        .map((cmd) => `• **/${cmd.data.name}** — ${cmd.data.description}`)
        .join("\n"),
      inline: false,
    });
  }

  await interaction.reply({
    embeds: [embed],
    flags: MessageFlags.Ephemeral,
  });
}
