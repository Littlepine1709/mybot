const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'status',
  description: 'Menampilkan status bot.',
  async execute(message, args) {
    const embed = new EmbedBuilder()
      .setColor('#FFD700') // Warna emas
      .setTitle('Status Bot')
      .setDescription('Bot sedang online dan berfungsi dengan baik!')
      .setFooter({ text: 'by Marmut 🐭' });

    message.reply({ embeds: [embed] });
  }
};
