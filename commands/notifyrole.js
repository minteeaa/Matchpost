const db = require('quick.db')
exports.run = (bot, message, args, func) => {
  let nc
  if (!message.member.hasPermission('ADMINISTRATOR')) return func.embed(message.channel, 'You require a role with the permission `Administrator` to use that.')
  if (!args[0]) return func.embed(message.channel, 'No args specified.')
  if (args[0] === 'clear') {
    db.delete(`mentionRole_${message.guild.id}`)
    return func.embed(message.channel, 'Removed notification role.')
  }
  let nr
  message.guild.roles.map(r => {
    if (r.name === args[0]) {
      nr = r.id
    }
  })
  if (!message.mentions.roles.first() && nr === undefined) return func.embed(message.channel, 'No valid role specified.')
  if (message.mentions.roles.first() !== undefined) nc = message.mentions.roles.first().id
  if (nr !== undefined) nc = nr
  db.set(`mentionRole_${message.guild.id}`, nc)
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
