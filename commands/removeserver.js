const db = require('quick.db')
exports.run = (bot, message, args, func) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return func.embed(message.channel, 'You require a role with the permission `Administrator` to use that.')
  if (!args[0]) return func.embed(message.channel, 'No args specfied.')
  else if (!db.get(`${args[0].replace(/\./gi, '%').replace(/:/gi, '$')}.discordServers`)) return func.embed(message.channel, 'Not a valid server.')
  const srvg = db.get(`${args[0].replace(/\./gi, '%').replace(/:/gi, '$')}.discordServers`)
  if (srvg.includes(message.guild.id)) {
    const nE = removeA(db.get(`${args[0].replace(/\./gi, '%').replace(/:/gi, '$')}.discordServers`), message.guild.id)
    db.set(`${args[0].replace(/\./gi, '%').replace(/:/gi, '$')}.discordServers`, nE)
    func.embed(message.channel, `Removed ${args[0]} from the post list of \`${message.guild.id}\`.`)
    if (db.get(`${args[0].replace(/\./gi, '%').replace(/:/gi, '$')}.discordServers`).length === 0) {
      const nnE = removeA(db.get('postServers'), args[0])
      db.set('postServers', nnE)
    }
  } else if (!srvg.includes(message.guild.id)) {
    func.embed(message.channel, `Server is not on the post list of \`${message.guild.id}\`.`)
  }
}

function removeA (arr) {
  let what
  const a = arguments
  let L = a.length
  let ax
  while (L > 1 && arr.length) {
    what = a[--L]
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1)
    }
  }
  return arr
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['removeserver', 'removeserv', 'rs']
}
exports.help = {
  name: 'removeserver',
  description: 'Remove servers from post list.',
  usage: 'removeserv <server>',
  group: 'admin'
}
