const Discord = require('discord.js')
const fs = require('fs')
const randomColor = require('randomcolor')
exports.run = (bot, message, args) => {
  const color = parseInt(randomColor().replace(/#/gi, '0x'))
  if (!args[0]) {
    let props
    let groups
    fs.readdir('./commands', (err, files) => {
      if (err) console.error(err)
      groups = []
      files.forEach(f => {
        props = require(`./${f}`)
        if (!groups[props.help.group]) {
          groups[props.help.group] = []
          groups[props.help.group].push(props.help.name)
        } else {
          groups[props.help.group].push(props.help.name)
        }
      })
      const x = []
      const embed = new Discord.RichEmbed()
      bot.commands.map(c => {
        if (!x[c.help.group]) {
          x[c.help.group] = []
        }
        if (x[c.help.group].length > 0) {
          return
        } else if (x[c.help.group].length === 0) {
          embed.addField(c.help.group.toUpperCase(), groups[c.help.group].toString().replace('[', '').replace(']', '').replace(/,/gi, ', '))
        }
        x[c.help.group].push(1)
      })
      files.forEach(f => {
        props = require(`./${f}`)
        x[props.help.group] = []
        groups[props.help.group] = []
      })
      embed.setTimestamp()
      embed.setColor(0xadd8e6)
      embed.setAuthor(`${bot.user.username}'s Commands`, bot.user.avatarURL)
      embed.setFooter(`Requested by ${message.author.username}`, message.author.avatarURL)
      message.channel.send({ embed })
    })
  } else {
    const embed = new Discord.RichEmbed()
    let command = args[0]
    if (bot.commands.has(command)) {
      command = bot.commands.get(command)
      let aliases = command.conf.aliases.toString().replace(/[|]/gi, ' ').replace(/,/gi, ', ')
      if (!aliases) aliases = 'None'
      else aliases = command.conf.aliases.toString().replace(/[|]/gi, ' ').replace(/,/gi, ', ')
      embed.setAuthor(command.help.name.toUpperCase())
        .setColor(color)
        .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL)
        .addField('Description', command.help.description)
        .addField('Usage', command.help.usage)
        .addField('Group', command.help.group)
        .addField('Aliases', aliases)
      message.channel.send({ embed })
    }
  }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: []
}
exports.help = {
  name: 'help',
  description: 'help.',
  usage: 'help [command]',
  group: 'user'
}
