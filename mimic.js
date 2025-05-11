const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const prefix = '.';

client.once('ready', () => {
  console.log('Bot aktif!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  if (command === 'mimic') {
    const content = args.join(' ');
    if (!content) return message.reply('Tolong masukkan pesan yang ingin dikirim.');

    try {
      await message.delete();
      await message.channel.send(content);
    } catch (error) {
      console.error('Gagal menjalankan perintah .mimic:', error);
    }
  }
});

client.login(process.env.TOKEN);
