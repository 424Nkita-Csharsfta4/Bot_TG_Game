const CommandHandler = require('./CommandHandler');
const TelegramBot = require('node-telegram-bot-api');

class Bot {
    constructor(token) {
        this.bot = new TelegramBot(token, { polling: true });
        this.commandHandler = new CommandHandler(this.bot); // Передача экземпляра TelegramBot в CommandHandler
    }

    start() {
        this.bot.on('message', this.handleMessage.bind(this));
    }

    handleMessage(message) {
        if (message.text.startsWith('/')) {
            const command = message.text.slice(1); // Удаление символа "/" из команды
            this.commandHandler.handleCommand(command, message.chat.id); // Передача идентификатора чата вместе с командой
        } else {
            // Обработка входящего сообщения
        }
    }
}

module.exports = Bot;
