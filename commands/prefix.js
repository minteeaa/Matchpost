const db = require('quick.db')
exports.run = (bot, message, args, func) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return func.embed(message.channel, 'You require the permission `Administrator` to use that.')
  if (!args[0]) {
    func.embed(message.channel, 'No prefix provided to switch to.')
  } else {
    const np = args.join('')
    db.set(`prefix_${message.guild.id}`, np)
    func.embed(message.channel, `Prefix changed to \`${np}\``)
  }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: []
}

exports.help = {
  name: 'prefix',
  description: 'Change the bot\'s prefix.',
  usage: 'prefix <prefix>',
  group: 'admin'
}
