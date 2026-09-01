import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import {t, getGuildLanguage, setGuildLanguage, SUPPORTED_LANGUAGES} from "../../i18n/index.js";

// Remplace ces deux fonctions par tes vrais appels DB (Prisma, Mongoose, SQLite, etc.)
async function dbGetGuildLanguage(guildId) {
  // ex Prisma: const guild = await prisma.guild.findUnique({ where: { id: guildId } }); return guild?.language;
  return null;
}
async function dbSetGuildLanguage(guildId, lang) {
  // ex Prisma: await prisma.guild.upsert({ where: { id: guildId }, update: { language: lang }, create: { id: guildId, language: lang } });
}

export const data = new SlashCommandBuilder()
  .setName("language")
  .setNameLocalizations({ fr: "langue" })
  .setDescription("Change or check the bot language for this server")
  .setDescriptionLocalizations({
    fr: "Change ou consulte la langue du bot sur ce serveur",
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addSubcommand((sub) =>
    sub
      .setName("set")
      .setDescription("Set the server language")
      .addStringOption((opt) =>
        opt
          .setName("lang")
          .setDescription("Language code")
          .setRequired(true)
          .addChoices(
            ...SUPPORTED_LANGUAGES.map((l) => ({ name: l, value: l })),
          ),
      ),
  )
  .addSubcommand((sub) =>
    sub.setName("current").setDescription("Show the current server language"),
  );

export async function execute(interaction) {
  const currentLang = await getGuildLanguage(
    interaction.guildId,
    dbGetGuildLanguage,
  );
  const sub = interaction.options.getSubcommand();

  if (sub === "current") {
    return interaction.reply(
      t("language.current", currentLang, { lang: currentLang }),
    );
  }

  // sub === 'set'
  const newLang = interaction.options.getString("lang");
  try {
    await setGuildLanguage(interaction.guildId, newLang, dbSetGuildLanguage);
    return interaction.reply(t("language.changed", newLang, { lang: newLang }));
  } catch (err) {
    return interaction.reply({
      content: t("language.invalid", currentLang, {
        list: SUPPORTED_LANGUAGES.join(", "),
      }),
      ephemeral: true,
    });
  }
}
