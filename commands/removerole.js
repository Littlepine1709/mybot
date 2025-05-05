const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'removerole',
  description: 'Menghapus role dari user.',
  async execute(message, args) {
    const member = message.mentions.members.first();
    const role = message.mentions.roles.first();

    if (!member || !role) {
      return message.reply('Gunakan format: `.removerole @user @role`');
    }

    try {
      await member.roles.remove(role);
      const embed = new EmbedBuilder()
        .setColor('#FFD700') // Warna emas
        .setTitle('Role Dihapus')
        .setDescription(`Role ${role.name} berhasil dihapus dari ${member.user.tag}.`)
        .setFooter({ text: 'by Marmut 🐭' });

      message.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.reply('Gagal menghapus role.');
    }
  }
};
