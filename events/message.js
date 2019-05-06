const db = require('quick.db')
const func = require('../functions.js')
const { createLogger, format, transports } = require('winston')
const { combine, printf } = format
const fm = printf(info => {
  return `[${info.level.toUpperCase()}]: ${info.message}`
})
const logger = createLogger({
  format: combine(
    fm
  ),
  transports: [new transports.Console()]
})
exports.run = (bot, message) => {
  let prefix = db.get(`prefix_${message.guild.id}`)
  if (!prefix) {
    prefix = 'm!'
  }
  if (!message.content.startsWith(prefix)) return
  const command = message.content.split(' ')[0].slice(prefix.length)
  const args = message.content.split(' ').slice(1)
  let cmd
  if (bot.commands.has(command)) {
    cmd = bot.commands.get(command)
  } else if (bot.aliases.has(command)) {
    cmd = bot.commands.get(bot.aliases.get(command))
  }
  if (cmd) {
    logger.log('info', `[${message.guild.name}] ${message.author.username}#${message.author.discriminator} > ${prefix}${command} ${args.toString().replace(/,/gi, ' ')}`)
    cmd.run(bot, message, args, func)
  } else {
    message.react('❌')
  }
}
