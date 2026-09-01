export const name = 'guildMemberAdd';
export const once = false;

export async function execute(member) {
  
  const channel = member.guild.systemChannel;

  if (channel && channel.permissionsFor(member.guild.members.me).has('SendMessages')) {
    try {
      await channel.send(`Bienvenue ${member.user}! 🎉`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message de bienvenue :', error);
    }
  }
}
