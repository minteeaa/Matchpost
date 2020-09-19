module.exports = {
  apps: [{
    name: 'Matchpost',
    script: 'bot.js',
    exec_mode: 'fork',
    instances: 1,
    watch: false,
    autorestart: true,
    output: './logs/matchpost/output.log',
    error: './logs/matchpost/error.log'
  }]
}
