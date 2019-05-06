exports.run = (bot, message, args, func) => {
  func.embed(message.channel, `Pong! Took \`${Date.now() - message.createdTimestamp} ms \`.`)
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: []
}

exports.help = {
  name: 'ping',
  description: 'Is the bot alive?',
  usage: 'ping',
  group: 'user'
}
