const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ID user yang akan dimimic oleh bot
const TARGET_USER_ID = '476959338087317504';

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Mengecek apakah pesan berasal dari user dengan ID yang ditargetkan
  if (message.author.id === TARGET_USER_ID) {
    try {
      const content = message.content || '*[pesan kosong]*';
      await message.delete();  // Hapus pesan asli

      // Kirim ulang pesan tanpa info user
      await message.channel.send(content);
    } catch (err) {
      console.error('Gagal mimic pesan:', err);
    }
  }
});

client.once('ready', () => {
  console.log('Bot Marmut siap menggantikan pesan target!');
});

client.login(process.env.TOKEN);
