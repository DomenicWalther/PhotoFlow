import { sveltekit } from '@sveltejs/kit/vite';
import { Server } from 'socket.io';
import getLocalIP from './src/lib/utils/getLocalIP';

const ORIGIN = getLocalIP() + ':5173';

const config = {
	plugins: [
		sveltekit(),
		{
			name: 'sveltekit-socketio',
			configureServer(server) {
				const io = new Server(3000, {
					cors: {
						origin: ORIGIN,
						methods: ['GET', 'POST']
					}
				});
				io.on('connection', (socket) => {
					socket.on('database-change', (msg) => {
						io.emit('database-changed', msg);
					});
				});
			}
		}
	],
	define: {
		'process.env': process.env
	}
};

export default config;
