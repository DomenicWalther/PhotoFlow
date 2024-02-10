import { sveltekit } from '@sveltejs/kit/vite';
import { Server } from 'socket.io';

const config = {
	plugins: [
		sveltekit(),
		{
			name: 'sveltekit-socketio',
			configureServer(server) {
				const io = new Server(3000, {
					cors: {
						origin: 'http://192.168.178.24:5173',
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
