const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

// Konstanta ID user yang dimimic
const TARGET_USER_ID = '476959338087317504';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log('Marmut sedang online');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Mimic otomatis
  const mimicCommand = client.commands.get('mimic');
  if (
    mimicCommand?.isMimicActive &&
    mimicCommand.isMimicActive() &&
    message.author.id === TARGET_USER_ID
  ) {
    try {
      const content = message.content || '*[pesan kosong]*';
      await message.delete();
      await message.channel.send(content);
      return;
    } catch (err) {
      console.error('Gagal mimic pesan:', err);
      return;
    }
  }

  // Command berbasis prefix
  if (!message.content.startsWith('.')) return;

  const [cmd, ...args] = message.content.slice(1).trim().split(/\s+/);
  const command = client.commands.get(cmd);

  if (command) {
    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply('Terjadi kesalahan saat menjalankan perintah.');
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  for (const command of client.commands.values()) {
    if (typeof command.handleInteraction === 'function') {
      try {
        await command.handleInteraction(interaction, client);
      } catch (error) {
        console.error(error);
      }
    }
  }
});

client.login(process.env.TOKEN);
