const TelegramBot = require('node-telegram-bot-api');


class QuizGame {
  constructor(bot) {
    this.bot = bot;
    this.questions = [
      {
        question: 'Что изображено на этом снимке NFT?',
        image: 'https://pbs.twimg.com/media/FLv7gkpXMAUkhl-?format=jpg&name=large',
        options: ['BTC', 'NFT', 'Ethrium', 'Coin'],
        correctAnswer: 0
      },
      {
        question: 'Question 2: What is the capital of France?',
        image: 'https://example.com/question2-nft-image.jpg',
        options: ['Paris', 'London', 'Berlin', 'Madrid'],
        correctAnswer: 0
      },
      // Add more questions here...
    ];
    this.currentQuestionIndex = 0;
    this.correctAnswers = 0;
  }

  startGame(chatId, callback) {
    this.currentQuestionIndex = 0;
    this.correctAnswers = 0;
    this.sendQuestion(chatId, callback);
  }

  sendQuestion(chatId, callback) {
    const question = this.questions[this.currentQuestionIndex];
    const message = `Question ${this.currentQuestionIndex + 1}: ${question.question}`;

    const optionsKeyboard = {
      reply_markup: {
        inline_keyboard: question.options.map((option, index) => [
          {
            text: `${index + 1}. ${option}`,
            callback_data: `${index}`
          }
        ])
      }
    };

    this.bot.sendPhoto(chatId, question.image, { caption: message });
    this.bot.sendMessage(chatId, 'Выберите вариант:', optionsKeyboard)
      .then(() => {
        this.bot.once('callback_query', (query) => {
          const answer = query.data;
          callback(answer, chatId);
        });
      })
      .catch((error) => {
        console.error('Ошибка при отправке вопроса:', error);
      });
  }

  handleAnswer(answer, chatId) {
    const question = this.questions[this.currentQuestionIndex];
    const isCorrect = parseInt(answer) === question.correctAnswer;
    if (isCorrect) {
      this.correctAnswers++;
    }
    this.currentQuestionIndex++;
    return isCorrect;
  }

  sendNextQuestion(chatId, callback) {
    if (this.currentQuestionIndex < this.questions.length) {
      this.sendQuestion(chatId, callback);
    } else {
      callback(true);
    }
  }
}

// Используйте свой токен для Telegram Bot API
const botToken = 'YOUR_BOT_TOKEN';
const bot = new TelegramBot(botToken, { polling: true });

module.exports = { bot, QuizGame };
