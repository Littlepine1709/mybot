const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'warn',
  description: 'Memberikan peringatan kepada member.',
  async execute(message, args) {
    const member = message.mentions.members.first();
    if (!member) return message.reply('Silakan sebutkan user yang ingin diperingatkan.');

    const embed = new EmbedBuilder()
      .setColor('#FFD700') // Warna emas
      .setTitle('Peringatan Diberikan')
      .setDescription(`${member.user.tag} telah diberikan peringatan.`)
      .setFooter({ text: 'by Marmut 🐭' });

    message.reply({ embeds: [embed] });
  }
};
