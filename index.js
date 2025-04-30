const TelegramBot = require('node-telegram-bot-api');
const token = '7159511918:AAFpElI9NXal7HitfYS3KV-3F1a1V2qZ6zo'; // замените на свой токен

const bot = new TelegramBot(token, { polling: true });

const userGames = {};

function startGame(chatId) {
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  userGames[chatId] = randomNumber;
  bot.sendMessage(chatId, 'Я загадал число от 1 до 100. Попробуй угадать!');
}

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Привет! Это игра "Угадай число". Напиши /game чтобы начать.');
});

bot.onText(/\/game/, (msg) => {
  startGame(msg.chat.id);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Игнорируем команды
  if (msg.text.startsWith('/')) return;

  const guess = parseInt(msg.text);
  const target = userGames[chatId];

  if (!target) {
    bot.sendMessage(chatId, 'Сначала запусти игру: /game');
    return;
  }

  if (isNaN(guess)) {
    bot.sendMessage(chatId, 'Пожалуйста, введи число.');
    return;
  }

  if (guess === target) {
    bot.sendMessage(chatId, `🎉 Поздравляю! Ты угадал число ${target}! Напиши /game чтобы сыграть снова.`);
    delete userGames[chatId];
  } else if (guess < target) {
    bot.sendMessage(chatId, 'Моё число больше.');
  } else {
    bot.sendMessage(chatId, 'Моё число меньше.');
  }
});