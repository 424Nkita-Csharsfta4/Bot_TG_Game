const { getNFTDescription } = require('./NFTGenerator');
const { QuizGame } = require('./QuizGame');

class CommandHandler {
  constructor(bot) {
    this.bot = bot;
    this.commands = new Map();
    this.initializeCommands();
    this.quizGame = new QuizGame(this.bot);
    this.userAnswers = new Map(); // Хранит ответы игроков
  }

  handleCommand(command, chatId) {
    switch (command) {
      case 'start':
        this.handleStartCommand(chatId);
        break;
      case 'help':
        this.handleHelpCommand(chatId);
        break;
      case 'custom':
        this.handleCustomCommand(chatId);
        break;
      case 'game':
        this.handleGameCommand(chatId);
        break;
      default:
        this.handleUnknownCommand(chatId);
        break;
    }
  }

  initializeCommands() {
    this.commands.set('start', 'Добро пожаловать к боту!');
    this.commands.set('help', 'Ниже перечислены доступные команды:');
    this.commands.set('custom', 'Это пользовательская команда!');
    this.commands.set('game', 'Играть в игру');
  }

  handleStartCommand(chatId) {
    const response = this.commands.get('start');
    const buttons = ['help', 'custom', 'game'];
    this.sendButtonMessage(chatId, response, buttons, (buttonCommand) => {
      this.handleCommand(buttonCommand, chatId);
    });
  }

  handleGameCommand(chatId) {
    const response = this.commands.get('game');
    this.sendMessage(chatId, response);
  
    const handleAnswer = (isCorrect) => {
      if (isCorrect) {
        this.sendMessage(chatId, 'Правильный ответ! 👍');
      } else {
        this.sendMessage(chatId, 'Не правильный ответ! 👎');
      }
  
      this.quizGame.sendNextQuestion(chatId, handleNextQuestion);
    };
  
    const handleNextQuestion = (isEnd) => {
      if (isEnd) {
        this.sendMessage(chatId, 'Игра окончена. Спасибо за игру!');
      } else {
        const question = this.quizGame.getCurrentQuestion(chatId);
        const questionText = question.text;
        const options = question.options;
  
        const message = `Вопрос:${questionText}\nОпции: ${options.join(', ')}`;
        this.sendButtonMessage(chatId, message, options, (buttonCommand) => {
          this.quizGame.submitAnswer(chatId, buttonCommand, handleAnswer);
        });
      }
    };
  
    this.quizGame.startGame(chatId, handleNextQuestion);
  }
  

  handleHelpCommand(chatId) {
    const response = this.commands.get('help');
    this.sendMessage(chatId, response);
  }

  handleUnknownCommand(chatId) {
    const response = 'Неизвестная команда. Введите /help для получения информации о доступных командах.';
    this.sendMessage(chatId, response);
  }

  sendMessage(chatId, message) {
    this.bot.sendMessage(chatId, message);
  }

  sendButtonMessage(chatId, message, buttons, callback) {
    const options = {
      reply_markup: JSON.stringify({
        keyboard: buttons.map((buttonText) => [{ text: buttonText }]),
        one_time_keyboard: true,
      }),
    };

    this.bot
      .sendMessage(chatId, message, options)
      .then(() => {
        this.bot.once('message', (response) => {
          const buttonCommand = response.text;
          callback(buttonCommand, chatId);
        });
      })
      .catch((error) => {
        console.error('Ошибка отправки сообщения кнопки:', error);
      });
  }

  sendImageWithCaption(chatId, imageUrl, caption) {
    this.bot.sendPhoto(chatId, imageUrl, { caption });
  }
}

module.exports = CommandHandler;
