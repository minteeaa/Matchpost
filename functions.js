const Discord = require('discord.js')
const randomColor = require('randomcolor')
module.exports = {

  embed: function (channel, message) {
    const color = parseInt(randomColor().replace(/#/gi, '0x'))
    const embed = new Discord.RichEmbed()
      .setColor(color)
      .setDescription(message)
    channel.send({ embed })
  }
}
