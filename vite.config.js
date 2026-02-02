import { sveltekit } from '@sveltejs/kit/vite';
import { Server } from 'socket.io';

const config = {
	plugins: [
		sveltekit(),
		{
			name: 'sveltekit-socketio',
			configureServer(server) {
				if (!server.httpServer) return;

				const io = new Server(server.httpServer, {
					cors: {
						origin: process.env.VITE_CORS_ORIGIN || '*',
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
	]
};

export default config;
