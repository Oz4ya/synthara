import { client } from "../../bot.js";

export const name = "guildDelete";
export const once = false;

const guildLeaveChannelId = "1508375401792012441";

async function sendGuildNotification(guild, channelId, action) {
  try {
    const channel = await client.channels.fetch(channelId);

    if (!channel) {
      return;
    }

    const message =
      action === "leave"
        ? `➖ Le bot a quitté le serveur : **${guild.name}** (ID : ${guild.id})`
        : `Notification de serveur inconnue.`;

    await channel.send(message);
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de la notification de serveur :",
      error,
    );
  }
}

export async function execute(guild) {
  if (guild.unavailable) {
    return;
  }

  await sendGuildNotification(guild, guildLeaveChannelId, "leave");
}
