const { Telegraf } = require('telegraf');
const http = require('http');

// Токен твоего бота (лучше потом вынести в переменные окружения Fly.io, но для теста можно вставить сюда)
const BOT_TOKEN = process.env.BOT_TOKEN || ' 8790246634:AAExluyoCgCKkNPIm7z2fBb1Q0smSqzwHEk';
const bot = new Telegraf(BOT_TOKEN);

// Ссылка на твое мини-приложение (TMA), когда оно будет готово на GitHub Pages / Vercel
const WEB_APP_URL = 'https://pkhark14-beep.github.io/Gruppac-countrytg-bot/'; // Заменишь на свою

// Команда /start
bot.start((ctx) => {
    ctx.reply('Привет! Доброболовать в глобальную стратегию. Нажми на кнопку ниже, чтобы открыть карту мира и управлять своей страной:', {
        reply_markup: {
            inline_keyboard: [
                [
                    { 
                        text: '🗺 Открыть карту мира', 
                        web_app: { url: WEB_APP_URL } 
                    }
                ]
            ]
        }
    });
});

// Запуск бота
bot.launch();
console.log('Telegram-бот успешно запущен!');

// Простейший HTTP-сервер для хостингов вроде Fly.io / Render, 
// чтобы они видели, что приложение живое и принимает порты
const PORT = process.env.PORT || 8080;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running!\n');
.listen(PORT, () => {
    console.log(`HTTP server is listening on port ${PORT}`);
});

// Корректная остановка
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));