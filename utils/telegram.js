const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

let bot;
if (token && token !== 'IL_TUO_TELEGRAM_BOT_TOKEN' && chatId) {
    bot = new TelegramBot(token, { polling: false });
}

const sendNotification = (message) => {
    if (bot && chatId) {
        bot.sendMessage(chatId, message).catch(err => console.error('Errore Telegram:', err.message));
    } else {
        console.log('Notifica Telegram (Simulata):', message);
    }
};

module.exports = { sendNotification };