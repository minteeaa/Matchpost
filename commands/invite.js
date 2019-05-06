exports.run = (bot, message, args, func) => {
  func.embed(message.channel, 'Invite link: https://bit.ly/2G8kL9o')
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['inv']
}

exports.help = {
  name: 'invite',
  description: 'Shows the bot invite.',
  usage: 'invite',
  group: 'user'
}
