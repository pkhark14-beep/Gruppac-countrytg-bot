const { Telegraf } = require('telegraf');
const http = require('http');
const { Server } = require('socket.io');

const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN';
const bot = new Telegraf(BOT_TOKEN);

const WEB_APP_URL = 'https://pkhark14-beep.github.io/Gruppac-countrytg-bot/';

// Команда /start
bot.start((ctx) => {
    ctx.reply('Привет! Добро пожаловать в нашу приватную онлайн-стратегию. Нажми кнопку ниже, чтобы зайти на карту:', {
        reply_markup: {
            inline_keyboard: [
                [
                    { 
                        text: '🗺 Войти на общую карту', 
                        web_app: { url: WEB_APP_URL } 
                    }
                ]
            ]
        }
    });
});

bot.launch();
console.log('Telegram-бот успешно запущен!');

// Создаем HTTP-сервер
const PORT = process.env.PORT || 10000;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
    });
    res.end('Game Socket Server is running!\n');
});

// Подключаем Socket.io для мультиплеера
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Хранилище захваченных клеток на карте
let mapState = {};

io.on('connection', (socket) => {
    console.log('Игрок подключился:', socket.id);

    // Отправляем новому игроку текущее состояние карты
    socket.emit('initMap', mapState);

    // Обработка захвата клетки
    socket.on('claimTile', (data) => {
        // data = { x, y, color, username }
        const tileKey = `${data.x}:${data.y}`;
        mapState[tileKey] = {
            color: data.color,
            owner: data.username
        };

        // Транслируем всем подключенным игрокам
        io.emit('updateTile', {
            x: data.x,
            y: data.y,
            color: data.color,
            owner: data.username
        });
    });

    socket.on('disconnect', () => {
        console.log('Игрок отключился:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`HTTP/Socket server is listening on port ${PORT}`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
