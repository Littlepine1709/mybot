const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Membanned member dari server.',
  async execute(message, args) {
    const member = message.mentions.members.first();
    if (!member) return message.reply('Silakan sebutkan user yang ingin diban.');

    try {
      await member.ban();
      const embed = new EmbedBuilder()
        .setColor('#FFD700') // Warna emas
        .setTitle('Ban Sukses')
        .setDescription(`${member.user.tag} berhasil dibanned dari server.`)
        .setFooter({ text: 'by Marmut 🐭' });

      message.reply({ embeds: [embed] });
    } catch (err) {
      message.reply('Gagal melakukan ban, pastikan bot memiliki izin yang cukup.');
    }
  }
};
