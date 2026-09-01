import chalk from 'chalk';

export const name = 'clientReady';
export const once = true;

export async function execute(client) {
  console.log(chalk.green.bold(`✅ Connecté en tant que ${chalk.cyan(client.user.tag)}`));

  try {
    client.user.setPresence({
      activities: [{ name: '/help', type: 0 }],
      status: 'online'
    });

    console.log(chalk.yellow('⚡ Statut du bot initialisé'));
  } catch (error) {
    console.error(chalk.red('❌ Erreur lors de l\'initialisation:'), error);
  }
}
