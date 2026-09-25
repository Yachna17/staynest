require('dotenv').config({ quiet: true });
const path = require('path');
const express = require('express');
const cors = require('cors');
const storage = require('./storage');
const { router: authRouter } = require('./routes/auth');
const hotelsRouter = require('./routes/hotels');

const app = express();

// Allowed frontend origins (comma-separated in CORS_ORIGIN), default: the React/Next dev server
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    exposedHeaders: ['X-Total-Count', 'Link'],
  })
);
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true }));

// Uploaded images: http://localhost:4000/uploads/<file>
app.use('/uploads', express.static(storage.UPLOAD_DIR));

// Home page: API guide
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));

app.use('/', authRouter);
app.use('/hotels', hotelsRouter);

app.use((req, res) => res.status(404).json({ message: 'Not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || (err.code === 'LIMIT_FILE_SIZE' || err.name === 'MulterError' ? 400 : 500);
  if (status === 500) console.error(err);
  res.status(status).json({ message: status === 500 ? 'Server error' : err.message });
});

module.exports = app;
