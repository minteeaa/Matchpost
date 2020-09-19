const db = require('quick.db')
exports.run = (bot, message, args, func) => {
  const sL = db.get('postServers')
  const srvs = []
  if (!sL) return func.embed(message.channel, 'No servers added, some should probably be added.')
  for (let x = 0; x < sL.length; x++) {
    const pL = db.get(`${sL[x].replace(/\./gi, '%').replace(/:/gi, '$')}.discordServers`)
    if (pL != null && typeof pL === 'object') {
      if (pL.includes(message.guild.id)) {
        srvs.push(sL[x])
      }
    }
  }
  func.embed(message.channel, srvs.toString().replace(/,/gi, ', '))
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['servlist', 'serverlist', 'sl']
}
exports.help = {
  name: 'servlist',
  description: 'List the servers that will be posted.',
  usage: 'servlist',
  group: 'info'
}
