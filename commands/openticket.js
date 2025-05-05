const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'openticket',
  async execute(message) {
    if (message.channel.id !== '1350897854666768425') return;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_v1').setLabel('V1').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('ticket_v2').setLabel('V2').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('ticket_v3').setLabel('V3').setStyle(ButtonStyle.Success)
    );

    const embed = new EmbedBuilder()
      .setTitle('Laporan duty harian')
      .setDescription('Silahkan klik sesuai cabang kamu untuk membuat laporan');

    await message.channel.send({ embeds: [embed], components: [row] });
  }
};
