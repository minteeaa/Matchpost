const db = require('quick.db')
exports.run = (bot, message, args, func) => {
  let prefix = db.get(`prefix_${message.guild.id}`)
  if (!prefix) { prefix = 'm!' }
  if (!args[0]) return func.embed(message.channel, `${prefix}links ubl\n${prefix}links hosting`)
  if (args[0] === 'ubl') {
    const cl = parseInt('0x' + Math.floor(Math.random() * 16777214).toString(16))
    message.channel.send({
      embed: {
        color: cl,
        title: 'UBL Links',
        description: 'Click to open, right click to copy.',
        fields: [
          {
            name: '\u200b',
            value: '[Plugin](https://github.com/Eluinhost/UBL)',
            inline: false
          },
          {
            name: '\u200b',
            value: '[UHC Courtroom](https://www.reddit.com/r/uhccourtroom/)',
            inline: false
          },
          {
            name: '\u200b',
            value: '[Ban Guidelines](https://www.reddit.com/r/uhccourtroom/wiki/banguidelines)',
            inline: false
          },
          {
            name: '\u200b',
            value: '[Report Form](https://docs.google.com/forms/d/e/1FAIpQLSc84oyzeBJgCQbJSxyAjVZvTqCxh-mFfVqDvgCeIMITJ7Gd7A/viewform)',
            inline: false
          },
          {
            name: '\u200b',
            value: '[Ban List](https://docs.google.com/spreadsheets/d/1VdyBZs4B-qoA8-IijPvbRUVBLfOuU9I5fV_PhuOWJao/edit#gid=0)',
            inline: false
          }
        ],
        timestamp: new Date(),
        footer: {
          text: `Requested by ${message.author.username}`,
          icon_url: message.author.avatarURL
        }
      }
    })
  } else if (args[0] === 'hosting') {
    const cl = parseInt(Math.floor(Math.random() * 16777215).toString(16))
    message.channel.send({
      embed: {
        color: cl,
        title: 'Hosting Links',
        description: 'Click to open, right click to copy.',
        fields: [
          {
            name: '\u200b',
            value: '[uhc.gg](https://c.uhc.gg/) / [hosts.uhc.gg](https://hosts.uhc.gg/)',
            inline: false
          },
          {
            name: '\u200b',
            value: '[r/UHCHosts](https://www.reddit.com/r/UHCHosts/)',
            inline: false
          },
          {
            name: '\u200b',
            value: '[Host Application](https://www.reddit.com/r/UHCHosts/wiki/host_application)',
            inline: false
          }
        ],
        timestamp: new Date(),
        footer: {
          text: `Requested by ${message.author.username}`,
          icon_url: message.author.avatarURL
        }
      }
    })
  }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['link']
}

exports.help = {
  name: 'links',
  description: 'Useful links for UHC.GG.',
  usage: 'links [hosting | ubl]',
  group: 'user'
}
