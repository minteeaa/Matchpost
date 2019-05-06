const db = require('quick.db')
const randomColor = require('randomcolor')
exports.run = (bot, message, args, func) => {
  const color = parseInt(randomColor().replace(/#/gi, '0x'))
  const pc = db.get(`postChannel_${message.guild.id}`)
  const nr = db.get(`mentionRole_${message.guild.id}`)
  const ps = db.get('postServers')
  let nrt
  let pct
  let srvst
  const srvs = []
  if (!ps) srvst = 'None'
  if (ps !== null) {
    for (let x = 0; x < ps.length; x++) {
      const pL = db.get(`serverList_${ps[x].replace('.', '-')}`)
      if (pL !== null) {
        if (typeof pL === 'number') {
          if (pL === message.guild.id) {
            srvs.push(ps[x])
          }
        } else if (typeof pL === 'object') {
          if (pL.includes(message.guild.id)) {
            srvs.push(ps[x])
          }
        }
      } else {
        srvst = 'None'
      }
    }
  }
  if (srvs.length === 0) srvst = 'None'
  else srvst = srvs.join(', ')
  if (!nr) nrt = 'None'
  else nrt = `<@&${nr}>`
  if (!pc) pct = 'None'
  else pct = `<#${pc}>`
  message.channel.send({ embed: {
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
