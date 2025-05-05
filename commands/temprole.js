const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'temprole',
  description: 'Memberikan role sementara ke user dengan waktu seperti 3d, 2h, atau 30m.',
  async execute(message, args) {
    const member = message.mentions.members.first();
    const role = message.mentions.roles.first();
    const timeArg = args[2];

    if (!member || !role || !timeArg) {
      return message.reply('Gunakan format: `.temprole @user @role 3d / 2h / 30m`');
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply('Saya tidak memiliki izin `Manage Roles`.');
    }

    const timeMatch = timeArg.match(/^(\d+)([dhm])$/i);
    if (!timeMatch) {
      return message.reply('Format waktu tidak valid. Gunakan format: `3d`, `2h`, atau `30m`.');
    }

    const value = parseInt(timeMatch[1]);
    const unit = timeMatch[2].toLowerCase();

    let timeMs;
    let waktuTampil;

    if (unit === 'd') {
      timeMs = value * 24 * 60 * 60 * 1000;
      waktuTampil = `${value} hari`;
    } else if (unit === 'h') {
      timeMs = value * 60 * 60 * 1000;
      waktuTampil = `${value} jam`;
    } else if (unit === 'm') {
      timeMs = value * 60 * 1000;
      waktuTampil = `${value} menit`;
    }

    try {
      await member.roles.add(role);

      const embed = new EmbedBuilder()
        .setColor('#2ECC71')
        .setTitle('Role Sementara Diberikan')
        .setDescription(`Role **${role.name}** diberikan ke **${member.user.tag}** selama **${waktuTampil}**.`)
        .setFooter({ text: 'by Marmut 🐭' })
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });

      setTimeout(async () => {
        if (member.roles.cache.has(role.id)) {
          await member.roles.remove(role);

          const removalEmbed = new EmbedBuilder()
            .setColor('#E74C3C')
            .setTitle('Role Sementara Dihapus')
            .setDescription(`Role **${role.name}** telah dihapus dari **${member.user.tag}**.`)
            .setFooter({ text: 'by Marmut 🐭' })
            .setTimestamp();

          await message.channel.send({ embeds: [removalEmbed] });
        }
      }, timeMs);
    } catch (err) {
      console.error(err);
      message.reply('Gagal memberikan role. Pastikan role tidak lebih tinggi dari saya & saya punya izin.');
    }
  }
};
