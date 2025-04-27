require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const path = require('path');
const http = require('http');
const { initializeSocket } = require('./services/socketService');

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);

app.use(require('./middleware/errorHandler'));

require('./scheduler/publishScheduler');

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
