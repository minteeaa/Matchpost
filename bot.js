require('dotenv').config()
const Discord = require('discord.js')
const bot = new Discord.Client()
const fs = require('fs')
const Enmap = require('enmap')

fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err)
  files.forEach(file => {
    const event = require(`./events/${file}`)
    const eventName = file.split('.')[0]
    bot.on(eventName, (...args) => event.run(bot, ...args))
  })
})

bot.commands = new Enmap()
bot.aliases = new Enmap()
bot.groups = {}
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err)
  console.log(`Loading a total of ${files.length} commands.`)
  files.forEach(f => {
    const props = require(`./commands/${f}`)
    console.log(`Loading Command: ${props.help.name}. :ok_hand:`)
    bot.commands.set(props.help.name, props)
    bot.groups[props.help.group] = []
    props.conf.aliases.forEach(alias => {
      bot.aliases.set(alias, props.help.name)
    })
  })
})
bot.login(process.env.BOT_TOKEN)
