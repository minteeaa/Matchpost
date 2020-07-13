const { add } = require('quick.db')

exports.run = (bot) => {
  const got = require('got')
  const date = require('date-and-time')
  const Discord = require('discord.js')
  const db = require('quick.db')
  const {
    createLogger,
    format,
    transports
  } = require('winston')
  const {
    combine,
    printf
  } = format
  const fm = printf(info => {
    return `[${info.level.toUpperCase()}]: ${info.message}`
  })
  const logger = createLogger({
    format: combine(
      fm
    ),
    transports: [new transports.Console()]
  })

  /*
   0 = Playing
   1 = Twitch
   2 = Listening to
   3 = Watching
  */

  const statuses = [{
    type: 0,
    name: 'on hosts.uhc.gg'
  },
  {
    type: 3,
    name: 'out for UHC matches'
  },
  {
    type: 0,
    name: 'a UHC game'
  }
  ]

  bot.changeStatus = function () {
    let type
    const status = statuses[~~(Math.random() * statuses.length)]
    if (status.type === 0) type = 'PLAYING'
    if (status.type === 2) type = 'LISTENING'
    if (status.type === 3) type = 'WATCHING'
    bot.user.setActivity(status.name, {
      type: type
    })
  }

  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  bot.pingHosts = function () {
    logger.log('info', 'Pinging hosts.uhc.gg API to refresh and sync...');
    (async () => {
      try {
        const r = await got('https://hosts.uhc.gg/api/matches/upcoming')
        const t = await got('https://hosts.uhc.gg/api/sync')
        logger.log('info', 'Successfully refreshed and synced from hosts.uhc.gg API.')
        const rj = JSON.parse(r.body)
        const tj = JSON.stringify(t.body).replace(/"|\\/gi, '')
        const sync = new Date(tj)
        const sync15 = date.addMinutes(sync, 15)
        let c = 0
        logger.log('debug', 'Set main variables for use.')
        let variableIp
        const serverList = []
        for (let p = 0; p < db.get('postServers').length; p++) serverList.push(db.get('postServers')[p])
        for (const x in rj) {
          if (c === 0) {
            const syncrj = new Date(rj[x].opens)
            const dd = addZero(syncrj.getUTCHours()) + ':' + addZero(syncrj.getUTCMinutes())
            if (sync15 >= syncrj && syncrj >= sync) {
              logger.log('info', `Match found within 15 minutes of start. (ID ${rj[x].id})`)
              if (db.get('postServers') == null) return logger.log('info', 'postServers is empty. :thinking:')
              else if (serverList.includes(rj[x].address) || serverList.includes(rj[x].ip)) {
                if (serverList.includes(rj[x].address)) variableIp = rj[x].address
                else if (serverList.includes(rj[x].ip)) variableIp = rj[x].ip
                logger.log('info', 'Match IP is on the Post List.')
                if (db.get(`${variableIp.replace(/\./gi, '%').replace(/:/gi, '$')}.discordServers`) != null) {
                  logger.log('info', 'Match IP has linked discord servers.')
                  let hn
                  if (!rj[x].hostingName) hn = rj[x].author
                  else hn = rj[x].hostingName
                  logger.log('info', 'Match Information:\n' +
                    `Host: u/${hn} (${rj[x].author})\n` +
                    `Time: ${dd}\n` +
                    `Count: ${rj[x].count}\n` +
                    `Post ID: ${rj[x].id}\n` +
                    `IP: ${variableIp}`
                  )
                  const pL = db.get(`${variableIp.replace(/\./gi, '%').replace(/:/gi, '$')}.discordServers`)
                  for (let u = 0; u < pL.length; u++) {
                    logger.log('info', `Looping through discord post servers (#${u + 1})`)
                    const srv = bot.guilds.get(pL[u])
                    if (db.get(`${srv.id}.postChannel`) != null) {
                      logger.log('info', `Server (#${u + 1}) has post channel`)
                      if (db.get(`${srv.id}.${rj[x].id}.posted`) === true) {
                        logger.log('info', 'Match is already posted.')
                        if (rj[x].removed === true) {
                          logger.log('info', 'Match has been removed since post.')
                          if (db.get(`${rj[x].id}.cancelMessageSent` !== true)) {
                            logger.log('info', 'Sending cancel message.')
                            srv.channels.get(db.get(`${pL[u]}.postChannel`)).send(`Match cancelled: \`${rj[x].removedReason}\``)
                            db.set(`${rj[x].id}.cancelMessageSent`, true)
                          } else {
                            logger.log('info', 'Match cancel message has already been posted.')
                          }
                        }
                      } else if (db.get(`${srv.id}.${rj[x].id}.posted`) !== true) {
                        logger.log('info', 'Match has not been posted.')
                        if (rj[x].removed === true) return logger.log('info', `Said match has been cancelled. (${hn}'s #${rj[x].count})`)
                        logger.log('info', 'Generating match post.')
                        let ts
                        if (rj[x].teams === 'ffa') {
                          ts = 'FFA'
                        } else if (rj[x].teams === 'rvb') {
                          ts = 'Red vs. Blue'
                        } else if (rj[x].teams === 'custom') {
                          ts = `${rj[x].customStyle}`
                        } else if (rj[x].teams === 'mystery') {
                          if (rj[x].size === 0) {
                            ts = 'Mystery ToX'
                          } else if (rj[x].size > 0) {
                            ts = `Mystery To${rj[x].size}`
                          }
                        } else if (rj[x].teams === 'market') {
                          ts = 'Slave Market'
                        } else if (rj[x].teams === 'chosen') {
                          ts = `Chosen To${rj[x].size}`
                        } else if (rj[x].teams === 'random') {
                          ts = `Random To${rj[x].size}`
                        } else if (rj[x].teams === 'captains') {
                          if (rj[x].size === 0) {
                            ts = 'Captains ToX'
                          } else if (rj[x].size > 0) {
                            ts = `Captains To${rj[x].size}`
                          }
                        }
                        const cl = '0x' + Math.floor(Math.random() * 16777215).toString(16)
                        const embed = new Discord.RichEmbed()
                        embed.setAuthor(`${hn}'s #${rj[x].count}`)
                          .setColor(cl)
                          .addField('Team Size', ts, true)
                          .addField('Slots', rj[x].slots, true)
                          .addField('IP', variableIp, true)
                          .addField('Open Time', `${dd} UTC`, true)
                          .addField('Post', `https://hosts.uhc.gg/m/${rj[x].id}`, true)
                          .addField('Scenario(s)', rj[x].scenarios.toString().replace(/,/gi, ', '))
                          .setFooter(`u/${rj[x].author}`)
                        if (db.get(`${pL[u]}.notifyRole`) != null) {
                          srv.channels.get(db.get(`${pL[u]}.postChannel`)).send((`<@&${db.get(`${pL[u]}.notifyRole`)}> (Use the \`${db.get(`prefix_${pL[u]}`)}togglealerts\` command to toggle match post alerts)`))
                        }
                        srv.channels.get(db.get(`${pL[u]}.postChannel`)).send({
                          embed
                        })
                        db.set(`${srv.id}.${rj[x].id}.posted`, true)
                      }
                    } else if (db.get(`${pL[u]}.postChannel`) == null) {
                      logger.log('info', 'Server doesn\'t have a post channel set.')
                    }
                  }
                } else if (db.get(`${variableIp.replace(/\./gi, '%').replace(/:/gi, '$')}.discordServers`) == null) {
                  logger.log('info', 'Somehow, the server doesn\'t have any post guilds. Nice.')
                }
                c++
              } else if (!db.get('postServers').includes(variableIp)) {
                logger.log('info', 'Server isn\'t on the post list.')
              }
            }
          }
        }
      } catch (error) {
        logger.log('error', error)
      }
    })()
  }
  setInterval(() => bot.pingHosts(), 60000)
  setInterval(() => bot.changeStatus(), 60000)
}
