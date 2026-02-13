// src/lib/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'reverb', // o 'pusher'
    key: '27ocbxgmhteniyxeaef7', // La misma que tienes en el .env de Laravel
    wsHost: '127.0.0.1',     // La IP de tu servidor Laravel
    wsPort: 8080,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
});

export default echo;