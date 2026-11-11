require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDatabase = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const readingRoutes = require('./routes/readingRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/reports', reportRoutes);
app.use(notFound);
app.use(errorHandler);

async function startServer() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.');
  }
  await connectDatabase();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Sweety API is running on port ${port}`));
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Unable to start Sweety API:', error.message);
    process.exitCode = 1;
  });
}

module.exports = app;
