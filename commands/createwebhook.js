const db = require('quick.db')
const discord = require('discord.js')

exports.run = (bot, message, args, func) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return func.embed(message.channel, 'You require a role with the permission `Administrator` to use that.')
  if (!db.get(`${message.guild.id}.postChannel`)) return func.embed(message.channel, 'There is no post channel set currently.')
  var pc = bot.channels.get(db.get(`${message.guild.id}.postChannel`))
  if (db.get(`${message.guild.id}.webHook`)) {
    const prv = db.get(`${message.guild.id}.webHook`)
    const hook = new discord.WebhookClient(prv.id, prv.token)
    hook.delete()
  }
  pc.createWebhook(
    'Matchpost Webhook',
    'https://cdn.discordapp.com/avatars/512063812405297177/b38ea5311776146056119029e287596e.png?size=1024'
  ).then(wb => {
    db.set(`${message.guild.id}.webHook`, { id: wb.id, token: wb.token })
  })
  return func.embed(message.channel, `Created a webhook in <#${db.get(`${message.guild.id}.postChannel`)}>.`)
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['createwh', 'cw', 'cwrh']
}
exports.help = {
  name: 'createwebhook',
  description: 'Creates a webhook in the post channel.',
  usage: 'createwebhook',
  group: 'admin'
}
