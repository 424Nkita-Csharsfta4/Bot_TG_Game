require('dotenv').config();
const Bot = require('./src/Bot');

const token = process.env.TELEGRAM_TOKEN;
const bot = new Bot(token);

bot.start();
