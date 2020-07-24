exports.run = (bot, message, args, func) => {
  const ubll = [
    {
      name: 'Plugin',
      value: '[Github Repo](https://github.com/Eluinhost/UBL)',
      inline: false
    },
    {
      name: 'UHC Courtroom',
      value: '[r/UHCCourtroom](https://www.reddit.com/r/uhccourtroom/)',
      inline: false
    },
    {
      name: 'Ban Guidelines',
      value: '[Ban Guidelines Wiki Post](https://www.reddit.com/r/uhccourtroom/wiki/banguidelines)',
      inline: false
    },
    {
      name: 'Report Form',
      value: '[Google Form](https://docs.google.com/forms/d/e/1FAIpQLSc84oyzeBJgCQbJSxyAjVZvTqCxh-mFfVqDvgCeIMITJ7Gd7A/viewform)',
      inline: false
    },
    {
      name: 'Ban List',
      value: '[Google Spreadsheet](https://docs.google.com/spreadsheets/d/1VdyBZs4B-qoA8-IijPvbRUVBLfOuU9I5fV_PhuOWJao/edit#gid=0)',
      inline: false
    }
  ]
  const hostl = [
    {
      name: 'Main links',
      value: '[uhc.gg](https://c.uhc.gg/) / [hosts.uhc.gg](https://hosts.uhc.gg/)',
      inline: false
    },
    {
      name: 'Host Application',
      value: 'https://goo.gl/w1fKwY',
      inline: false
    },
    {
      name: 'Hosting Rules',
      value: 'http://bit.ly/HostingRules',
      inline: false
    }
  ]
  const cl = parseInt('0x' + Math.floor(Math.random() * 16777214).toString(16))
  const embed = {
    embed: {
      color: cl,
      description: 'Click to open, right click to copy.'
    }
  }
  if (!args[0]) {
    embed.embed.title = 'Links'
    embed.embed.fields = ubll.concat(hostl)
  }
  if (args[0] === 'ubl') {
    embed.embed.title = 'UBL Links'
    embed.embed.fields = ubll
  } else if (args[0] === 'hosting') {
    embed.embed.title = 'Hosting Links'
    embed.embed.fields = hostl
  }
  embed.embed.timestamp = new Date()
  embed.embed.footer = {
    text: `Requested by ${message.author.username}`,
    icon_url: message.author.avatarURL
  }
  message.channel.send(embed)
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['link']
}

exports.help = {
  name: 'links',
  description: 'Useful links for UHC.GG.',
  usage: 'links [hosting | ubl]',
  group: 'user'
}
