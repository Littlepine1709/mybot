const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Menampilkan daftar perintah bot',
  async execute(message, args) {
    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('Daftar Perintah Bot')
      .setDescription('Berikut adalah daftar perintah yang tersedia:')
      .addFields(
        { name: '.status', value: 'Menampilkan status bot' },
        { name: '.userinfo', value: 'Menampilkan informasi pengguna' },
        { name: '.serverinfo', value: 'Menampilkan informasi server' },
        { name: '.purge', value: 'Menghapus sejumlah pesan' },
        { name: '.kick', value: 'Mengeluarkan member dari server' },
        { name: '.ban', value: 'Membanned member dari server' },
        { name: '.warn', value: 'Memberikan peringatan ke member' },
        { name: '.addrole', value: 'Menambahkan role ke member' },
        { name: '.removerole', value: 'Menghapus role dari member' },
        { name: '.temprole', value: 'Memberikan role sementara ke member' },
        { name: '.announce', value: 'Mengirim pengumuman ke channel' },
        { name: '.logmecha', value: 'Mencatat log mekanik seperti promote, demote, dan blacklist' }
      )
      .setFooter({ text: 'by Marmut 🐭' });

    await message.reply({ embeds: [embed] });
  }
};
