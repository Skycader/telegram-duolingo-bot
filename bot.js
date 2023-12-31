const fs = require('fs');
const scrape = require('./is-online.js');
let token = fs.readFileSync('token', { encoding: 'utf8' });
token = token.replace('\n', '');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(token, {
  polling: true,
});

bot.on('message', (msg) => {
  let command = msg.text.split(' ');
  console.log(command);
  switch (command[0]) {
    case '/check':
      check(msg.chat.id, command[1]);
      break;
  }
});

function check(chatid, userid) {
  bot.sendMessage(chatid, 'Just a moment...');
  //bot.sendMessage(msg.chat.id, `Hello, ${msg.chat.first_name}`)
  scrape(userid).then((value) => {
    let data = JSON.parse(value.stock);
    console.log(value.stock);
    console.log(data);
    if (data.users.length === 0) {
      bot.sendMessage(
        chatid,
        'Error! ' + userid + ': such user not found!',
      );
      return;
    }

    bot.sendMessage(
      chatid,
      'This user has streak of ' +
      data.users[0].streak +
      ' days',
    );

    try {
      let online =
        data.users[0].streakData.currentStreak.endDate;
      let today = new Date().toISOString().split('T')[0];
      console.log(online, today);

      let result = online === today;
      if (result) {
        bot.sendMessage(
          chatid,
          userid +
          ', your family seems to be safe today💚' +
          online,
        );
      } else {
        bot.sendMessage(
          chatid,
          userid +
          ', it looks like you forgot your everyday lesson today, you know what may happen to your family❗️❗️❗️',
        );
      }
      //bot.sendPhoto({ chat_id: msg.chat.id, caption: 'Your family seems to be safe today!', photo: 'happy.jpg' }).then(function(data) {
      // console.log(data);
      //  });
    } catch (e) {
      bot.sendMessage(
        chatid,
        userid +
        ', it looks like you forgot your everyday lesson today, you know what may happen to your family❗️❗️❗️',
      );
    }
  });
}
