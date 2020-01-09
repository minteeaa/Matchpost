const db = require('quick.db')
exports.run = (bot, message, args, func) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return func.embed(message.channel, 'You require a role with the permission `Administrator` to use that.')
  if (!args[0]) {
    return func.embed(message.channel, 'No args specfied.')
  }
  if (args[0] === 'clear') {
    db.delete(`${message.guild.id}.postChannel`)
    return func.embed(message.channel, 'Removed posting channel. Matches will not be posted.')
  }
  if (!message.mentions.channels.first()) {
    return func.embed(message.channel, 'No valid channel provided.')
  }
  let nc = message.mentions.channels.first().id
  db.set(`${message.guild.id}.postChannel`, nc)
  return func.embed(message.channel, `Set the posting channel to <#${nc}>`)
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['postchannel', 'pc']
}
exports.help = {
  name: 'postchannel',
  description: 'Set the post channel.',
  usage: 'postchannel <channel>',
  group: 'admin'
}
