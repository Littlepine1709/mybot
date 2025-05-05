const { EmbedBuilder } = require('discord.js');
module.exports = {
  name: 'on',
  async execute(message) {
    const dutyRoleName = '⌚︱Onduty';
    const allowedRoles = ['🎎 ︱All Technician V1', '🎎 ︱All Technician V2', '🎎 ︱All Technician V3'];
    const allowedChannelId = '1366375800663969882';
    const logChannelId = '123456789012345678'; // ganti dengan ID log kamu

    if (message.channel.id !== allowedChannelId) return;
    const member = message.member;
    if (!member.roles.cache.some(r => allowedRoles.includes(r.name))) return message.reply('Kamu tidak punya izin.');

    const dutyRole = message.guild.roles.cache.find(role => role.name === dutyRoleName);
    if (!dutyRole) return message.reply('Role tidak ditemukan.');

    if (!member.roles.cache.has(dutyRole.id)) await member.roles.add(dutyRole);

    const embed = new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle('✅ ON DUTY')
      .addFields({ name: 'Nickname', value: member.displayName, inline: true }, { name: 'Status', value: 'Aktif Bertugas', inline: true }, { name: 'User', value: `<@${member.id}>` })
      .setFooter({ text: 'Status Update', iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
    await message.delete();
    const logChannel = await message.client.channels.fetch(logChannelId).catch(() => null);
    if (logChannel) await logChannel.send({ embeds: [embed] });
  }
};
