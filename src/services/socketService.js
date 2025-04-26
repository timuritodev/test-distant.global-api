const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initializeSocket = (server) => {
	io = new Server(server, {
		cors: {
			origin: process.env.CLIENT_URL || 'http://localhost:5173',
			methods: ['GET', 'POST'],
			credentials: true,
			allowedHeaders: ['Authorization'],
		},
		path: '/socket.io/',
		transports: ['websocket', 'polling'],
	});

	io.use((socket, next) => {
		const token = socket.handshake.auth.token;
		if (!token) {
			return next(new Error('Authentication error'));
		}

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			socket.userId = decoded.id;
			next();
		} catch (err) {
			return next(new Error('Authentication error'));
		}
	});

	io.on('connection', (socket) => {
		console.log('Client connected:', socket.id, 'User ID:', socket.userId);

		socket.on('disconnect', () => {
			console.log('Client disconnected:', socket.id);
		});
	});

	return io;
};

const sendNotification = (event, data) => {
	if (io) {
		io.emit('notification', {
			id: Date.now().toString(),
			message: data.message,
			createdAt: new Date().toISOString(),
			read: false,
			newsId: data.newsId,
		});
	}
};

module.exports = {
	initializeSocket,
	sendNotification,
};
