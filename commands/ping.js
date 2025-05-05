module.exports = {
  name: 'ping',
  async execute(message, args, client) {
    message.reply('Pong!');
  }
};
