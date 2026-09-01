import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname n'existe pas nativement en ESM, on le reconstruit
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Langues supportées (le nom de fichier .json doit correspondre)
export const SUPPORTED_LANGUAGES = ["fr", "en"];
export const DEFAULT_LANGUAGE = "fr";

// Chargement de toutes les traductions en mémoire au démarrage
const translations = {};
for (const lang of SUPPORTED_LANGUAGES) {
  const filePath = path.join(__dirname, "locales", `${lang}.json`);
  translations[lang] = JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Cache en mémoire : guildId -> langue (évite de requêter la DB à chaque message)
const guildLanguageCache = new Map();

/**
 * Récupère une valeur imbriquée via une clé pointée, ex: "automod.warned"
 */
function getNested(obj, keyPath) {
  return keyPath
    .split(".")
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

/**
 * Remplace les {{placeholders}} dans une chaîne
 */
function interpolate(str, vars = {}) {
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    vars[key] !== undefined ? vars[key] : `{{${key}}}`,
  );
}

/**
 * Traduit une clé pour une langue donnée.
 * Fallback automatique vers DEFAULT_LANGUAGE si la clé est absente.
 */
export function t(key, lang = DEFAULT_LANGUAGE, vars = {}) {
  const langToUse = SUPPORTED_LANGUAGES.includes(lang)
    ? lang
    : DEFAULT_LANGUAGE;
  let value = getNested(translations[langToUse], key);

  if (value === undefined) {
    value = getNested(translations[DEFAULT_LANGUAGE], key);
  }
  if (value === undefined) {
    return key; // dernier recours : renvoyer la clé brute (utile pour repérer les clés manquantes)
  }

  return interpolate(value, vars);
}

/**
 * Récupère la langue d'un serveur (avec cache).
 * `dbGetGuildLanguage` doit être une fonction fournie par ton projet
 * qui va chercher la langue en base (ex: Prisma, MongoDB, SQLite...).
 */
export async function getGuildLanguage(guildId, dbGetGuildLanguage) {
  if (guildLanguageCache.has(guildId)) {
    return guildLanguageCache.get(guildId);
  }
  const lang = (await dbGetGuildLanguage(guildId)) || DEFAULT_LANGUAGE;
  guildLanguageCache.set(guildId, lang);
  return lang;
}

/**
 * Met à jour la langue d'un serveur (cache + DB via la fonction fournie).
 */
export async function setGuildLanguage(guildId, lang, dbSetGuildLanguage) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    throw new Error(`Langue non supportée : ${lang}`);
  }
  await dbSetGuildLanguage(guildId, lang);
  guildLanguageCache.set(guildId, lang);
}
