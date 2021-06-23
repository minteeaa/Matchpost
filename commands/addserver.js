const db = require('quick.db')
exports.run = (bot, message, args, func) => {
  if (!message.member.permissions.has('ADMINISTRATOR')) return func.embed(message.channel, 'You require a role with the permission `Administrator` to use that.')
  if (!args[0]) return func.embed(message.channel, 'No args specfied.')
  if (!db.fetch('postServers')) {
    db.set('postServers', [args[0]])
    cGL(message, args, func)
  } else if (db.fetch('postServers').includes(args[0])) {
    cGL(message, args, func)
  } else if (!db.fetch('postServers').includes(args[0])) {
    db.push('postServers', args[0])
    cGL(message, args, func)
  }
}

function cGL (message, args, func) {
  const sL = db.fetch(`${args[0].replace(/\./gi, '%').replace(/:/gi, '$')}.discordServers`)
  if (!sL) {
    db.set(`${args[0].replace(/\./gi, '%').replace(/:/gi, '$')}.discordServers`, [message.guild.id])
    return func.embed(message.channel, `\`${args[0]}\` was successfully added to the post list for \`${message.guild.id}\`.`)
  } else if (sL != null && typeof sL === 'object') {
    if (!sL.includes(message.guild.id)) {
      db.push(`${args[0].replace(/\./gi, '%').replace(/:/gi, '$')}.discordServers`, message.guild.id)
      return func.embed(message.channel, `\`${args[0]}\` was successfully added to the post list for \`${message.guild.id}\`.`)
    } else if (sL.includes(message.guild.id)) {
      return func.embed(message.channel, `\`${args[0]}\` is already on the post list for \`${message.guild.id}\`.`)
    }
  }
  if (!db.get(`${message.guild.id}.postChannel`)) func.embed(message.channel, 'There is no post channel set. Set one with the `postchannel` command.')
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['addserver', 'addserv', 'as']
}
exports.help = {
  name: 'addserver',
  description: 'Add servers to the post list.',
  usage: 'addserv <server>',
  group: 'admin'
}
