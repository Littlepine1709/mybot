const { Client, GatewayIntentBits, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField, ChannelType, Partials } = require('discord.js');

// Inisialisasi client Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel]
});

// Role support yang boleh akses channel tiket
const SUPPORT_ROLES = [
  '1357912248395497754', // Management
  '1333774031463256065', // Chief V1
  '1333774546326786059', // Co-Chief
  '1334083914440118308', // Manager V1
  '1335409823231115304', // Foreman V1
  '1352117784800268451', // Foreman V2
  '1352119165317550080', // Foreman V3
  '1334081438290546728'  // Head Technician
];

// ID kategori tiap cabang
const CATEGORY_IDS = {
  V1: '1352438705545150464',
  V2: '1351920524493721640',
  V3: '1351920767700570112',
};

// Role teknisi cabang
const ROLE_PER_CABANG = {
  V1: '1335439863775756370',
  V2: '1351866533126606909',
  V3: '1338100667096764436',
};

// Format laporan per cabang
const FORMAT_LAPORAN = {
  V1: `Laporan dan setoran harian\nNama : \nJam on duty : \nJam off duty : \nHal apa yang di kerjakan: \nBerapa compo yang di gunakan : \nPenghasilan : \nAda salah pakai berapa compo : \n## ** Bukti ss on duty dan off duty di ws menu dan menggunakan jam di hp, dan logs penggunaan compo, serta deposit setoran **\nNote : \n𝙏𝙖𝙜 : <@&1335409823231115304>`,
  V2: `Laporan dan setoran harian\nNama :  \nJam on duty :\nJam off duty :\nHal apa yang di kerjakan:  \nBerapa compo yang di gunakan : \nPenghasilan :\nAda salah pakai berapa compo : \n##  Bukti ss on duty dan off duty di ws menu dan menggunakan jam di hp, dan logs penggunaan compo, serta deposit setoran\nNote : \n𝙏𝙖𝙜 : <@&1352117784800268451>`,
  V3: `Laporan dan setoran harian\nNama :\nJam on duty :\nJam off duty :\nHal apa yang di kerjakan:\nBerapa compo yang di gunakan :\nPenghasilan :\nAda salah pakai berapa compo :\nBukti ss on duty dan off duty di ws menu dan menggunakan jam di hp, dan logs penggunaan compo, serta deposit setoran\nNote :\n𝙏𝙖𝙜 : <@&1352119165317550080>`
};

client.once(Events.ClientReady, () => {
  console.log('Marmut sedang online');
});

// Command .openticket
client.on(Events.MessageCreate, async (message) => {
  if (!message.content.startsWith('.openticket')) return;
  if (message.channel.id !== '1350897854666768425') return; // Memastikan hanya bekerja di channel tertentu

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('ticket_v1').setLabel('V1').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('ticket_v2').setLabel('V2').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('ticket_v3').setLabel('V3').setStyle(ButtonStyle.Success)
  );

  const embed = new EmbedBuilder()
    .setTitle('Laporan duty harian')
    .setDescription('Silahkan klik sesuai cabang kamu untuk membuat laporan');

  message.channel.send({ embeds: [embed], components: [row] });
});

// Tombol open ticket
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return; // Hanya tangani interaksi tombol

  if (!interaction.customId.startsWith('ticket_')) return; // Memastikan customId sesuai dengan format tiket

  const cabang = interaction.customId.split('_')[1].toUpperCase(); // Mendapatkan cabang dari customId
  const roleId = ROLE_PER_CABANG[cabang];

  if (!interaction.member.roles.cache.has(roleId)) {
    return interaction.reply({ content: `Kamu tidak memiliki izin membuka tiket untuk cabang ${cabang}`, ephemeral: true });
  }

  const user = interaction.user;
  const nameMiddle = user.displayName?.split(' ')[1]?.toLowerCase() || user.username.toLowerCase();
  const branchName = cabang.toLowerCase();
  const channelName = `laporan-${nameMiddle}-${branchName}`;
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
      ...SUPPORT_ROLES.map(roleId => ({
        id: roleId,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.ManageChannels,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory
        ]
      }))
    ]
  });

  const closeButton = new ButtonBuilder().setCustomId('close_ticket').setLabel('Close Ticket').setStyle(ButtonStyle.Danger);
  const deleteButton = new ButtonBuilder().setCustomId('delete_ticket').setLabel('Delete Ticket').setStyle(ButtonStyle.Secondary);
  const actionRow = new ActionRowBuilder().addComponents(closeButton, deleteButton);

  await channel.send({
    content: `<@${user.id}> silahkan isi format berikut ini:`,
    components: [actionRow],
    embeds: [new EmbedBuilder().setDescription(FORMAT_LAPORAN[cabang])]
  });

  await interaction.reply({ content: `Tiket untuk cabang ${cabang} berhasil dibuat: ${channel}`, ephemeral: true });
});

// Tombol close dan delete
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  const allowedCloserRoles = [
    '1357912248395497754', '1333774031463256065', '1333774546326786059',
    '1334083914440118308', '1351827232342937651'
  ];
  const allowedDeleterRoles = ['1357912248395497754', '1333774031463256065'];

  if (interaction.customId === 'close_ticket') {
    if (!interaction.member.roles.cache.some(role => allowedCloserRoles.includes(role.id)))
      return interaction.reply({ content: 'Kamu tidak memiliki izin untuk menutup tiket.', ephemeral: true });

    await interaction.channel.permissionOverwrites.edit(interaction.channel.guild.roles.everyone, { SendMessages: false });
    await interaction.reply({ content: 'Tiket dikunci oleh tim support.', ephemeral: true });
  }

  if (interaction.customId === 'delete_ticket') {
    if (!interaction.member.roles.cache.some(role => allowedDeleterRoles.includes(role.id)))
      return interaction.reply({ content: 'Kamu tidak memiliki izin untuk menghapus tiket.', ephemeral: true });

    await interaction.reply({ content: 'Tiket akan dihapus dalam 5 detik.', ephemeral: true });
    setTimeout(() => interaction.channel.delete(), 5000);
  }
});
