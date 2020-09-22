const fs = require('fs')
const { google } = require('googleapis')
const TOKEN_PATH = './token.json'
const randomColor = require('randomcolor')
exports.run = (bot, message, args, func) => {
  if (!args[0]) func.embed(message.channel, 'No query for UBL search.')
  else {
    fs.readFile('./credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err)
      authorize(JSON.parse(content), searchUBL, args[0])
    })
  }
  function authorize (credentials, callback, query) {
    /* eslint-disable */
    const { client_secret, client_id, redirect_uris } = credentials.installed
    /* eslint-enable */
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0])

    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) func.embed(message.channel, 'An error occurred while authenticating with the Google API. Please bring this up to the bot developer.')
      oAuth2Client.setCredentials(JSON.parse(token))
      callback(oAuth2Client, query)
    })
  }

  function searchUBL (auth, qu) {
    const sheets = google.sheets({ version: 'v4', auth })
    sheets.spreadsheets.values.get({
      spreadsheetId: '1VdyBZs4B-qoA8-IijPvbRUVBLfOuU9I5fV_PhuOWJao',
      range: 'Universal Ban List!A2:G'
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err)
      const rows = res.data.values
      let found = false
      let str
      if (rows.length) {
        rows.map((row) => {
          if (row[0].toString() === qu) {
            found = true
            str = {
              embed: {
                author: {
                  name: `${row[0]}'s Ban`,
                  icon_url: bot.user.avatarURL
                },
                color: parseInt(randomColor().replace(/#/gi, '0x')),
                fields: [
                  {
                    name: 'Reason',
                    value: row[2]
                  },
                  {
                    name: 'Date',
                    value: row[3],
                    inline: true
                  },
                  {
                    name: 'Length',
                    value: row[4],
                    inline: true
                  },
                  {
                    name: 'Expiry Date',
                    value: row[5]
                  },
                  {
                    name: 'Case',
                    value: row[6]
                  }
                ],
                footer: {
                  text: `Requested by ${message.author.username}`,
                  icon_url: message.author.avatarURL
                }
              }
            }
          } else {
            if (found === false) str = 'The user specified is not on the Ban List.'
          }
        })
      } else {
        return func.embed(message.channel, 'An error occurred while getting data.')
      }
      if (typeof str === 'object') message.channel.send(str)
      else func.embed(message.channel, str)
    })
  }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: []
}

exports.help = {
  name: 'ubl',
  description: 'Check a player\'s UBL status.',
  usage: 'ubl <user>',
  group: 'user'
}
