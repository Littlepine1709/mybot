const {
  ChannelType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js');

// ID role dan kategori
const SUPPORT_ROLES = [
  '1357912248395497754', '1333774031463256065', '1333774546326786059',
  '1334083914440118308', '1335409823231115304', '1352117784800268451',
  '1352119165317550080', '1334081438290546728'
];

const CATEGORY_IDS = {
  V1: '1352438705545150464',
  V2: '1351920524493721640',
  V3: '1351920767700570112',
};

const ROLE_PER_CABANG = {
  V1: '1335439863775756370',
  V2: '1351866533126606909',
  V3: '1338100667096764436',
};

const FORMAT_LAPORAN = {
  V1: `Laporan dan setoran harian\nNama : \nJam on duty : \nJam off duty : \nHal apa yang di kerjakan: \nBerapa compo yang di gunakan : \nPenghasilan : \nAda salah pakai berapa compo : \n## ** Bukti ss on duty dan off duty di ws menu dan menggunakan jam di hp, dan logs penggunaan compo, serta deposit setoran **\nNote : \n𝙏𝙖𝙜 : <@&1335409823231115304>`,
  V2: `Laporan dan setoran harian\nNama :  \nJam on duty :\nJam off duty :\nHal apa yang di kerjakan:  \nBerapa compo yang di gunakan : \nPenghasilan :\nAda salah pakai berapa compo : \n##  Bukti ss on duty dan off duty di ws menu dan menggunakan jam di hp, dan logs penggunaan compo, serta deposit setoran\nNote : \n𝙏𝙖𝙜 : <@&1352117784800268451>`,
  V3: `Laporan dan setoran harian\nNama :\nJam on duty :\nJam off duty :\nHal apa yang di kerjakan:\nBerapa compo yang di gunakan :\nPenghasilan :\nAda salah pakai berapa compo :\nBukti ss on duty dan off duty di ws menu dan menggunakan jam di hp, dan logs penggunaan compo, serta deposit setoran\nNote :\n𝙏𝙖𝙜 : <@&1352119165317550080>`
};

module.exports = {
  name: 'ticketHandler',
  async handleInteraction(interaction) {
    const user = interaction.user;
    const member = interaction.member;

    // Buka Ticket
    if (interaction.customId.startsWith('ticket_')) {
      const cabang = interaction.customId.split('_')[1].toUpperCase();
      const roleId = ROLE_PER_CABANG[cabang];

      if (!member.roles.cache.has(roleId)) {
        return interaction.reply({ content: `Kamu tidak memiliki izin membuka tiket untuk cabang ${cabang}`, ephemeral: true });
      }

      const nameMiddle = member.displayName?.split(' ')[1]?.toLowerCase() || user.username.toLowerCase();
      const channelName = `laporan-${nameMiddle}-${cabang.toLowerCase()}`;
      const categoryId = CATEGORY_IDS[cabang];

      const channel = await interaction.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: categoryId,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [PermissionsBitField.Flags.ViewChannel]
          },
          {
            id: user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.AttachFiles,
              PermissionsBitField.Flags.ReadMessageHistory
            ]
          },
          ...SUPPORT_ROLES.map(id => ({
            id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.ManageChannels,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory
            ]
          }))
        ]
      });

      const actionRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('close_ticket').setLabel('Close Ticket').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('delete_ticket').setLabel('Delete Ticket').setStyle(ButtonStyle.Secondary)
      );

      await channel.send({
        content: `<@${user.id}> silahkan isi format berikut ini:`,
        components: [actionRow],
        embeds: [new EmbedBuilder().setDescription(FORMAT_LAPORAN[cabang])]
      });

      return interaction.reply({ content: `Tiket ${channel} berhasil dibuat.`, ephemeral: true });
    }

    // Close Ticket
    if (interaction.customId === 'close_ticket') {
      const allowed = [
        '1357912248395497754', '1333774031463256065', '1333774546326786059',
        '1334083914440118308', '1351827232342937651'
      ];
      if (!member.roles.cache.some(r => allowed.includes(r.id)))
        return interaction.reply({ content: 'Kamu tidak memiliki izin untuk menutup tiket.', ephemeral: true });

      await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
      return interaction.reply({ content: 'Tiket dikunci oleh tim support.', ephemeral: true });
    }

    // Delete Ticket
    if (interaction.customId === 'delete_ticket') {
      const allowed = ['1357912248395497754', '1333774031463256065'];
      if (!member.roles.cache.some(r => allowed.includes(r.id)))
        return interaction.reply({ content: 'Kamu tidak memiliki izin untuk menghapus tiket.', ephemeral: true });

      await interaction.reply({ content: 'Tiket akan dihapus dalam 5 detik.', ephemeral: true });
      setTimeout(() => interaction.channel.delete(), 5000);
    }
  }
};
