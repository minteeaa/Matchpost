exports.run = (bot) => {
  const got = require('got')
  const date = require('date-and-time')
  const Discord = require('discord.js')
  const db = require('quick.db')
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

  /*
   0 = Playing
   1 = Twitch
   2 = Listening to
   3 = Watching
  */

  const statuses = [
    { type: 0, name: 'on hosts.uhc.gg' },
    { type: 3, name: 'out for UHC matches' },
    { type: 0, name: 'a UHC game' }
  ]

  bot.changeStatus = function () {
    let type
    const status = statuses[~~(Math.random() * statuses.length)]
    if (status.type === 0) type = 'PLAYING'
    if (status.type === 2) type = 'LISTENING'
    if (status.type === 3) type = 'WATCHING'
    bot.user.setActivity(status.name, {
      'type': type
    })
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
        for (const x in rj) {
          if (c === 0) {
            const syncrj = new Date(rj[x].opens)
            const dd = syncrj.getUTCHours() + ':' + syncrj.getUTCMinutes()
            if (sync15 >= syncrj && syncrj >= sync) {
              logger.log('info', 'Match found within 15 minutes of start.')
              if (db.get(`postServers`) === null) return logger.log('info', 'postServers is empty. :thinking:')
              else if (db.get(`postServers`).includes(rj[x].address)) {
                logger.log('info', 'Match IP is on the Post List.')
                if (db.get(`serverList_${rj[x].address.replace('.', '-')}`) !== null) {
                  logger.log('info', 'Match IP has linked discord servers.')
                  logger.log('info', 'Match Information:\n' +
                  `Host: u/${rj[x].hostingName} (${rj[x].author})\n` +
                  `Time: ${dd}\n` +
                  `Count: ${rj[x].count}\n` +
                  `Post ID: ${rj[x].id}\n` +
                  `IP: ${rj[x].address}`
                  )
                  const pL = db.get(`serverList_${rj[x].address.replace('.', '-')}`)
                  for (let u = 0; u <= pL.length; u++) {
                    logger.log('info', `Looping through discord post servers (#${u + 1})`)
                    const srv = bot.guilds.get(pL[u])
                    if (db.get(`postChannel_${pL[u]}`) !== null) {
                      logger.log('info', `Server (#${u + 1}) has post channel`)
                      if (db.get(`posted_${rj[x].id}_${srv.id}`) === true) {
                        logger.log('info', 'Match is already posted.')
                        if (rj[x].removed === true) {
                          logger.log('info', 'Match has been removed since post.')
                          if (db.get(`sentCancelMessage_${rj[x].id}` !== true)) {
                            logger.log('info', 'Sending cancel message.')
                            srv.channels.get(db.get(`postChannel_${pL[u]}`)).send(`Match cancelled: \`${rj[x].removedReason}\``)
                            db.set(`sentCancelMessage_${rj[x].id}`, true)
                          } else {
                            logger.log('info', 'Match cancel message has already been posted.')
                          }
                        }
                      } else if (db.get(`posted_${rj[x].id}_${srv.id}`) !== true) {
                        logger.log('info', 'Match has not been posted.')
                        if (rj[x].removed === true) {
                          return logger.log('info', `Match found -- but cancelled. (${rj[x].hostingName}'s #${rj[x].count})`)
                        }
                        logger.log('info', 'Generating match post.')
                        let ts
                        if (rj[x].teams === 'ffa') {
                          ts = 'FFA'
                        } else if (rj[x].teams === 'rvb') {
                          ts = 'Red vs. Blue'
                        } else if (rj[x].teams === 'custom') {
                          ts = '${rj[x].customStyle}'                          
                        } else if (rj[x].teams === 'mystery') {
                          if (rj[x].size === 0) {
                              ts = `Mystery ToX`
                          } else if (rj[x].size > 0) {
                              ts = `Mystery To${rj[x].size}`
                          }
                        } else if (rj[x].teams === 'market') {
                          ts = 'Slave Market'
                        } else if (rj[x].teams !== 'ffa') {
                          if (rj[x].teams === 'chosen') {
                            ts = `Chosen To${rj[x].size}`
                          }
                          if (rj[x].teams === 'random') {
                            ts = `Random To${rj[x].size}`
                          }
                        }
                        const cl = '0x' + Math.floor(Math.random() * 16777215).toString(16)
                        const embed = new Discord.RichEmbed()
                        let hn
                        if (!rj[x].hostingName) {
                          hn = rj[x].author
                        } else {
                          hn = rj[x].hostingName
                        }
                        if (rj[x].tournament == true) {
                          embed.setAuthor(`${hn}'s #${rj[x].count} [Tournament]`)
                        } else {
                          embed.setAuthor(`${hn}'s #${rj[x].count}`)
                        }
                          .setColor(cl)
                          .addField('Team Size', ts, true)
                          .addField('Slots', rj[x].slots, true)
                          .addField('IP', rj[x].address, true)
                          .addField('Open Time', `${dd} UTC`, true)
                          .addField('Post', `https://hosts.uhc.gg/m/${rj[x].id}`, true)
                          .addField('Scenario(s)', rj[x].scenarios.toString().replace(/,/gi, ', '))
                          .setFooter(`u/${rj[x].author}`)
                        if (db.get(`mentionRole_${pL[u]}`) !== null) {
                          srv.channels.get(db.get(`postChannel_${pL[u]}`)).send((`<@&${db.get(`mentionRole_${pL[u]}`)}> (Use \`${db.get(`prefix_${pL[u]}togglealerts\` to toggle match post alerts)`))
                        }
                        srv.channels.get(db.get(`postChannel_${pL[u]}`)).send({ embed })
                        db.set(`posted_${rj[x].id}_${srv.id}`, true)
                      }
                    } else if (db.get(`postChannel_${pL[u]}`) === null) {
                      logger.log('info', 'Server doesn\'t have a post channel set.')
                    }
                  }
                } else if (db.get(`serverList_${rj[x].address.replace('.', '-')}`) === null) {
                  logger.log('info', 'Somehow, the server doesn\'t have any post guilds. Nice.')
                }
                c++
              } else if (!db.get(`postServers`).includes(rj[x].address)) {
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
