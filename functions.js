const Discord = require('discord.js')
const randomColor = require('randomcolor')
module.exports = {

  embed: function (channel, message) {
    const color = parseInt(randomColor().replace(/#/gi, '0x'))
    const embed = new Discord.MessageEmbed()
      .setColor(color)
      .setDescription(message)
    channel.send({ embed })
  },
  rcolor: function () {
    return parseInt(randomColor().replace(/#/gi, '0x'))
  }
}
