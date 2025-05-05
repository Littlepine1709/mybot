const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'userinfo',
  description: 'Menampilkan informasi user.',
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    
    const embed = new EmbedBuilder()
      .setColor('#FFD700') // Warna emas
      .setTitle(`Informasi User: ${user.username}`)
      .addFields(
        { name: 'Username', value: user.username, inline: true },
        { name: 'ID', value: user.id, inline: true },
        { name: 'Tag', value: user.tag, inline: true },
        { name: 'Bot?', value: user.bot ? 'Ya' : 'Tidak', inline: true }
      )
      .setFooter({ text: 'by Marmut 🐭' });

    message.reply({ embeds: [embed] });
  }
};
