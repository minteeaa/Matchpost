exports.run = (bot, message, args, func) => {
  func.embed(message.channel, '[Invite link](https://discord.com/oauth2/authorize?client_id=512063812405297177&scope=bot&permissions=8)')
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
