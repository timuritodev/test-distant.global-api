require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);

app.use(require('./middleware/errorHandler'));

require('./scheduler/publishScheduler');

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
