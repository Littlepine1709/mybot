module.exports = {
  name: 'mimic',
  async execute(message, args) {
    const mimicMessage = args.join(' ');
    if (!mimicMessage) return message.reply('Harap berikan pesan untuk ditiru!');
    await message.delete();
    await message.channel.send(mimicMessage);
  }
};
