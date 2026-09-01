import { client } from "../../bot.js";

export const name = "guildCreate";
export const once = false;

const guildJoinChannelId = "1508375401792012440";

async function sendGuildNotification(guild, channelId, action) {
  try {
    const channel = await client.channels.fetch(channelId);

    if (!channel) {
      return;
    }

    const message =
      action === "join"
        ? `➕ Le bot a été ajouté au serveur : **${guild.name}** (ID : ${guild.id})`
        : `Notification de serveur inconnue.`;

    await channel.send(message);
  } catch (error) {
    // Vous pouvez gérer l'erreur ici si besoin, ou la laisser silencieuse
  }
}

export async function execute(guild) {
  await sendGuildNotification(guild, guildJoinChannelId, "join");
}
