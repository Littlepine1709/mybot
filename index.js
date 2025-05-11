const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(port, () => {
  console.log(`Web server aktif di http://localhost:${port}`);
});

// Setup Discord Client
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

// Baca semua file command dari folder ./commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log('Marmut sedang online');
});

// Listener untuk perintah berbasis prefix (misal: .ping)
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('.') || message.author.bot) return;

  const [cmd, ...args] = message.content.slice(1).trim().split(/ +/);
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

// Listener untuk tombol
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
