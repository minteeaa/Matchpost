const db = require('quick.db')
exports.run = (bot, message, args, func) => {
  let nc
  if (!message.member.hasPermission('ADMINISTRATOR')) return func.embed(message.channel, 'You require a role with the permission `Administrator` to use that.')
  if (!args[0]) return func.embed(message.channel, 'No args specified.')
  if (args[0] === 'clear') {
    db.delete(`${message.guild.id}.notifyRole`)
    return func.embed(message.channel, 'Removed notification role.')
  }
  let nr
  message.guild.roles.map(r => {
    if (r.name === args[0]) {
      nr = r.id
    }
  })
  if (!message.mentions.roles.first() && nr == null) return func.embed(message.channel, 'No valid role specified.')
  if (message.mentions.roles.first() != null) nc = message.mentions.roles.first().id
  if (nr != null) nc = nr
  db.set(`${message.guild.id}.notifyRole`, nc)
  return func.embed(message.channel, `Set the notification role to <@&${nc}>`)
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['notifyrole', 'nr']
}
exports.help = {
  name: 'notifyrole',
  description: 'Set the notification role.',
  usage: 'notifyrole <channel>',
  group: 'admin'
}
