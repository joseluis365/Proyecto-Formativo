import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const wsHost = new URL(backendUrl).hostname;
const isProduction = backendUrl.startsWith("https");

const echo = new Echo({
    broadcaster: 'reverb',
    key: '27ocbxgmhteniyxeaef7',
    wsHost: wsHost,
    wsPort: isProduction ? 443 : 8080,
    wssPort: isProduction ? 443 : 8080,
    forceTLS: isProduction,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
});

export default echo;
