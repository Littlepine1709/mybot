const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'purge',
  description: 'Menghapus sejumlah pesan.',
  async execute(message, args) {
    if (!args[0] || isNaN(args[0])) {
      return message.reply('Silakan masukkan jumlah pesan yang ingin dihapus.');
    }

    const amount = parseInt(args[0]);
    await message.channel.bulkDelete(amount, true);

    const embed = new EmbedBuilder()
      .setColor('#FFD700') // Warna emas
      .setTitle('Purge Sukses')
      .setDescription(`Berhasil menghapus ${amount} pesan.`)
      .setFooter({ text: 'by Marmut 🐭' });

    message.reply({ embeds: [embed] });
  }
};
