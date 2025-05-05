const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'logmecha',
  description: 'Mencatat log promosi, demosi, atau blacklist mekanik',
  async execute(message, args) {
    // Validasi argumen
    if (args.length < 5) {
      return message.reply('Format salah!\nContoh: `.logmecha @user "Nama IC" "promote to @role" "Reason" "Note"`');
    }

    const target = message.mentions.members.first();
    if (!target) return message.reply('Kamu harus tag pengguna yang ingin dilog.');

    const rawArgs = message.content.match(/"([^"]+)"/g);
    if (!rawArgs || rawArgs.length < 4) return message.reply('Gunakan tanda kutip "..." untuk masing-masing informasi.');

    const nameIC = rawArgs[0].replace(/"/g, '');
    const actionRaw = rawArgs[1].replace(/"/g, '');
    const reason = rawArgs[2].replace(/"/g, '');
    const note = rawArgs[3].replace(/"/g, '');

    const actionLower = actionRaw.toLowerCase();
    let actionDisplay = '';
    let footerText = '';
    let footerIcon = message.author.displayAvatarURL({ dynamic: true });

    if (actionLower.includes('promote')) {
      actionDisplay = actionRaw;
      footerText = `Congrats to ${target.displayName}`;
      footerIcon = target.displayAvatarURL({ dynamic: true });
    } else if (actionLower.includes('demote')) {
      actionDisplay = actionRaw.replace(/demote to/i, 'Demoted to');
      footerText = `Demoted by ${message.member.displayName}`;
    } else if (actionLower.includes('blacklist')) {
      actionDisplay = actionRaw;
      footerText = `Blacklisted by ${message.member.displayName}`;
    } else {
      return message.reply('Aksi tidak dikenal! Gunakan "promote to", "demote to", atau "blacklist to".');
    }

    const embed = new EmbedBuilder()
      .setColor(actionLower.includes('blacklist') ? '#000000' : actionLower.includes('demote') ? '#FF0000' : '#00FF00')
      .setTitle('Mechanic Log')
      .addFields(
        { name: 'Nama IC', value: nameIC, inline: true },
        { name: 'Discord', value: `${target}`, inline: true },
        { name: 'Action', value: actionDisplay, inline: false },
        { name: 'Reason', value: reason, inline: false },
        { name: 'Note', value: note || '-', inline: false }
      )
      .setFooter({ text: footerText, iconURL: footerIcon })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
