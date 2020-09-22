const db = require('quick.db')
const randomColor = require('randomcolor')
exports.run = (bot, message, args, func) => {
  const color = parseInt(randomColor().replace(/#/gi, '0x'))
  const pc = db.fetch(`${message.guild.id}.postChannel`)
  const nr = db.fetch(`${message.guild.id}.notifyRole`)
  const wb = db.fetch(`${message.guild.id}.webHook`)
  const ps = db.fetch('postServers')
  let nrt
  let pct
  let wbs
  let srvst
  const srvs = []
  if (!ps) srvst = 'None'
  if (ps != null) {
    for (let x = 0; x < ps.length; x++) {
      const pL = db.fetch(`${ps[x].replace(/\./gi, '%').replace(/:/gi, '$')}.discordServers`)
      if (pL != null && typeof pL === 'object') {
        if (pL.includes(message.guild.id)) {
          srvs.push(ps[x])
        }
      } else {
        srvst = 'None'
      }
    }
  }
  if (srvs.length === 0) srvst = 'None'
  else srvst = srvs.join(', ')
  if (!wb) wbs = 'Not setup'
  else wbs = 'Setup'
  if (!nr) nrt = 'None'
  else nrt = `<@&${nr}>`
  if (!pc) pct = 'None'
  else pct = `<#${pc}>`
  message.channel.send({
    embed: {
      color: color,
      author: {
        name: 'Server Config - ' + message.guild.name,
        icon_url: bot.user.avatarURL
      },
      fields: [{
        name: 'Posting Channel',
        value: pct
      },
      {
        name: 'Notify Role',
        value: nrt
      },
      {
        name: 'Webhooks',
        value: wbs
      },
      {
        name: 'Server List',
        value: srvst
      }
      ],
      timestamp: new Date(),
      footer: {
        icon_url: message.author.avatarURL,
        text: `Requested by ${message.author.username}`
      }
    }
  })
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: []
}

exports.help = {
  name: 'config',
  description: 'View the server config',
  usage: 'config',
  group: 'info'
}
