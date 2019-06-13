const db = require('quick.db')
exports.run = (bot, message, args, func) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return func.embed(message.channel, 'You require a role with the permission `Administrator` to use that.')
  if (!args[0]) {
    return func.embed(message.channel, 'No args specfied.')
  }
  if (!db.get('postServers')) {
    db.push('postServers', args[0])
    cGL(message, args, func)
  } else if (db.get('postServers').includes(args[0])) {
    cGL(message, args, func)
  } else if (!db.get('postServers').includes(args[0])) {
    db.push('postServers', args[0])
    cGL(message, args, func)
  }
}

function cGL (message, args, func) {
  const sL = db.get(`serverList_${args[0].replace('.', '-')}`)
  if (!sL) {
    db.push(`serverList_${args[0].replace('.', '-')}`, message.guild.id)
    func.embed(message.channel, 'The server was successfully added.')
    return
  }
  if (sL !== null && typeof sL === 'object') {
    if (!sL.includes(message.guild.id)) {
      db.push(`serverList_${args[0].replace('.', '-')}`, message.guild.id)
      func.embed(message.channel, 'The server was successfully added.')
    } else if (sL.includes(message.guild.id)) {
      func.embed(message.channel, 'The server is already on the post list.')
    }
  } else if (sL !== null && typeof sL === 'number') {
    if (sL === message.guild.id) {
      func.embed(message.channel, 'The server is already on the post list.')
    } else if (sL !== message.guild.id) {
      db.delete(`serverList_${args[0].replace('.', '-')}`)
      db.set(`serverList_${args[0].replace('.', '-')}`, [sL.toString(), message.guild.id])
      func.embed(message.channel, 'The server was successfully added.')
    }
  }
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
