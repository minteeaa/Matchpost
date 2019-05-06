const db = require('quick.db')
const Discord = require('discord.js')
exports.run = (bot, message, args, func) => {
  const embed = new Discord.RichEmbed()
  const cl = '0x' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase()
  if (!db.get(`mentionRole_${message.guild.id}`)) return func.embed(message.channel, 'There is no notification role set currently.')
  const role = message.guild.roles.find(r => r.id === db.get(`mentionRole_${message.guild.id}`))
  if (message.member.roles.find(r => r.id === db.get(`mentionRole_${message.guild.id}`))) {
    message.member.removeRole(role)
    embed.setDescription('Your match notifications have been toggled off.')
    embed.setColor(cl)
    embed.setFooter(message.author.username)
    embed.setTimestamp()
    message.channel.send({ embed })
  }
  if (!message.member.roles.find(r => r.id === db.get(`mentionRole_${message.guild.id}`))) {
    message.member.addRole(role)
    embed.setDescription('Your match notifications have been toggled on.')
    embed.setColor(cl)
    embed.setFooter(message.author.username)
    embed.setTimestamp()
    message.channel.send({ embed })
  }
}
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['alerts', 'alert', 'notification', 'notifications', 'notify', 'togglealert', 'togglenotifs', 'togglealerts', 'togglenotif', 'togglenotification', 'togglenotifications', 'tn', 'ta']
}
exports.help = {
  name: 'togglealert',
  description: 'Toggles the notifications for match posts.',
  usage: 'togglealert',
  group: 'user'
}
