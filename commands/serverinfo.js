const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'serverinfo',
  description: 'Menampilkan informasi server.',
  async execute(message, args) {
    const server = message.guild;
    
    const embed = new EmbedBuilder()
      .setColor('#FFD700') // Warna emas
      .setTitle(`Informasi Server: ${server.name}`)
      .addFields(
        { name: 'Nama Server', value: server.name, inline: true },
        { name: 'ID Server', value: server.id, inline: true },
        { name: 'Jumlah Member', value: `${server.memberCount}`, inline: true },
        { name: 'Tanggal Dibuat', value: server.createdAt.toDateString(), inline: true }
      )
      .setFooter({ text: 'by Marmut 🐭' });

    message.reply({ embeds: [embed] });
  }
};
