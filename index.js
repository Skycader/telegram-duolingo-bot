const fs = require('fs')

let token = fs.readFileSync('token', { encoding: 'utf8' })
token = token.replace("\n", "")
const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(token, {
  polling: true
})

bot.on('message', (msg) => {
  console.log(msg)
  bot.sendMessage(msg.chat.id, `Hello, ${msg.chat.first_name}`)
})
