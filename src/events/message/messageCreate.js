import { checkAfk } from '../../commands/utility/afk.js';

export const name = 'messageCreate';
export const once = false;

export async function execute(message) {
  if (message.author.bot) return; // Ignorer les bots

  // Vérifier si des utilisateurs mentionnés sont AFK et notifier
  checkAfk(message);

  // Exemple simple : répondre "Salut" si message = "bonjour"
  if (message.content.toLowerCase() === 'bonjour') {
    message.channel.send(`Salut ${message.author}! 👋`);
  }
}
