const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'addrole',
  description: 'Menambahkan role ke user.',
  async execute(message, args) {
    const member = message.mentions.members.first();
    const role = message.mentions.roles.first();

    if (!member || !role) {
      return message.reply('Gunakan format: `.addrole @user @role`');
    }

    try {
      await member.roles.add(role);
      const embed = new EmbedBuilder()
        .setColor('#FFD700') // Warna emas
        .setTitle('Role Ditambahkan')
        .setDescription(`Role ${role.name} berhasil ditambahkan ke ${member.user.tag}.`)
        .setFooter({ text: 'by Marmut 🐭' });

      message.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.reply('Gagal menambahkan role.');
    }
  }
};
