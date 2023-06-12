const QuizGame = require('./QuizGame');

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.quizGame = new QuizGame(bot);
  }

  handleMessage(message) {
    if (message.text) {
      const command = message.text.trim();

      switch (command) {
        case '/start':
          this.handleStartCommand(message.chat.id);
          break;
        case '/help':
          this.handleHelpCommand(message.chat.id);
          break;
        case '/custom':
          this.handleCustomCommand(message.chat.id);
          break;
        case '/game':
          this.handleGameCommand(message.chat.id);
          break;
        default:
          this.handleUnknownCommand(message.chat.id);
          break;
      }
    } else if (message.photo) {
      this.handlePhotoMessage(message);
    } else {
      this.handleUnknownMessage(message.chat.id);
    }
  }

  handleStartCommand(chatId) {
    const response = 'Добро пожаловать на бот!';
    const buttons = ['Help', 'Custom', 'Game'];
    this.sendButtonMessage(chatId, response, buttons);
  }

  handleHelpCommand(chatId) {
    const response = 'Вот доступные команды:\n/start - Запустить бота\n/help - Показать сообщение помощи\n/custom - Получить произвольный NFT\n/game - Играть в игру';
    this.sendMessage(chatId, response);
  }

  handleCustomCommand(chatId) {
    const response = this.commands.get('custom');
    this.sendMessage(chatId, response);
  
    // Генерируем случайное NFT-изображение
    const nftImageUrl = generateRandomNFT();
  
    // Отправляем NFT-изображение с подписью
    const caption = 'Зацените этот случайный NFT!';
    this.sendImageWithCaption(chatId, nftImageUrl, caption);
  }
  

  handleGameCommand(chatId) {
    const response = 'Давайте сыграем в игру!';
    this.sendMessage(chatId, response);
    this.quizGame.startGame(chatId);
  }

  handleUnknownCommand(chatId) {
    const response = 'Неизвестная команда. Введите /help для получения информации о доступных командах.';
    this.sendMessage(chatId, response);
  }

  handlePhotoMessage(message) {
    const response = 'Получено сообщение с фотографией';
    this.sendMessage(message.chat.id, response);
  }

  handleUnknownMessage(chatId) {
    const response = 'Получено неизвестное сообщение';
    this.sendMessage(chatId, response);
  }

  sendMessage(chatId, message) {
    this.bot.sendMessage(chatId, message);
  }

  sendButtonMessage(chatId, message, buttons) {
    const options = {
      reply_markup: JSON.stringify({
        keyboard: buttons.map(buttonText => [{ text: buttonText }])
      })
    };
    this.bot.sendMessage(chatId, message, options);
  }

  sendImageWithCaption(chatId, imageUrl, caption) {
    this.bot.sendPhoto(chatId, imageUrl, { caption });
  }
}

function getRandomNFTImage() {
  // Здесь должна быть логика получения случайной NFT-картинки
  // Верните URL или путь к случайной NFT-картинке
  return 'https://s3.us-east-2.amazonaws.com/nfttech-prod-tokens/ipfs/QmeDTDS8BJY3CBnLVykCr8NVEQ1PNh8tBuv2xDkLNVsuPM.png';
}

function getNFTDescription(imageUrl) {
  // Здесь должна быть логика получения описания для указанной NFT-картинки
  // Верните описание NFT-картинки
  return 'Это случайное изображение NFT с красивым художественным оформлением.';
}

module.exports = MessageHandler;
