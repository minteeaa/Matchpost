const db = require('quick.db')
const Discord = require('discord.js')
exports.run = async (bot, message, args, func) => {
  const embed = new Discord.MessageEmbed()
  const cl = '0x' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase()
  if (!db.get(`${message.guild.id}.notifyRole`)) return func.embed(message.channel, 'There is no notification role set currently.')
  const role = await message.guild.roles.cache.find(r => r.id === db.get(`${message.guild.id}.notifyRole`))
  if (message.member.roles.cache.find(r => r.id === db.get(`${message.guild.id}.notifyRole`))) {
    try {
      await message.member.roles.remove(role)
      embed.setDescription('Your match notifications have been toggled off.')
      embed.setColor(cl)
      embed.setFooter(message.author.username)
      embed.setTimestamp()
      return message.channel.send({ embed })
    } catch (e) {
      if (e.message === 'Missing Permissions') {
        embed.setTitle('Error')
        embed.setDescription('Matchpost does not have the correct permissions to remove roles to this user.')
        embed.setColor(0xFF0000)
        embed.setFooter(message.author.username)
        embed.setTimestamp()
        message.channel.send({ embed })
      }
      console.log('Error:')
      console.log(e.message)
    }
  }
  if (!message.member.roles.cache.find(r => r.id === db.get(`${message.guild.id}.notifyRole`))) {
    try {
      await message.member.roles.add(role)
      embed.setDescription('Your match notifications have been toggled on.')
      embed.setColor(cl)
      embed.setFooter(message.author.username)
      embed.setTimestamp()
      return message.channel.send({ embed })
    } catch (e) {
      if (e.message === 'Missing Permissions') {
        embed.setTitle('Error')
        embed.setDescription('Matchpost does not have the correct permissions to assign roles to this user.')
        embed.setColor(0xFF0000)
        embed.setFooter(message.author.username)
        embed.setTimestamp()
        message.channel.send({ embed })
      }
      console.log('Error:')
      console.log(e.message)
    }
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
