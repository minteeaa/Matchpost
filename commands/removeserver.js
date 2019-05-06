const db = require('quick.db')
exports.run = (bot, message, args, func) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return func.embed(message.channel, 'You require a role with the permission `Administrator` to use that.')
  if (!args[0]) {
    return func.embed(message.channel, 'No args specfied.')
  }
  if (!db.get(`serverList_${args[0].replace('.', '-')}`)) return func.embed(message.channel, 'Not a valid server.')
  if (db.get(`serverList_${args[0].replace('.', '-')}`).includes(message.guild.id)) {
    let nE = removeA(db.get(`serverList_${args[0].replace('.', '-')}`), message.guild.id)
    db.set(`serverList_${args[0].replace('.', '-')}`, nE)
    func.embed(message.channel, 'Removed server successfully.')
    if (db.get(`serverList_${args[0].replace('.', '-')}`).length === 0) {
      let nnE = removeA(db.get('postServers'), args[0])
      db.set('postServers', nnE)
    }
  } else if (!db.get(`serverList_${args[0].replace('.', '-')}`).includes(message.guild.id)) {
    func.embed(message.channel, 'Server is not on the server list.')
  }
}

function removeA (arr) {
  let what
  let a = arguments
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
