const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Mengeluarkan member dari server.',
  async execute(message, args) {
    const member = message.mentions.members.first();
    if (!member) return message.reply('Silakan sebutkan user yang ingin dikick.');

    try {
      await member.kick();
      const embed = new EmbedBuilder()
        .setColor('#FFD700') // Warna emas
        .setTitle('Kick Sukses')
        .setDescription(`${member.user.tag} berhasil dikick dari server.`)
        .setFooter({ text: 'by Marmut 🐭' });

      message.reply({ embeds: [embed] });
    } catch (err) {
      message.reply('Gagal melakukan kick, pastikan bot memiliki izin yang cukup.');
    }
  }
};
