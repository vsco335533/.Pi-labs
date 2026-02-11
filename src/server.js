// import dotenv from 'dotenv';
// dotenv.config({ path: "./.env" })
// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';

// import rateLimit from 'express-rate-limit';

// import { runMigrations } from './utils/migrationRunner.js';
// import authRoutes from './routes/authRoutes.js';
// import postRoutes from './routes/postRoutes.js';
// import categoryRoutes from './routes/categoryRoutes.js';
// import mediaRoutes from './routes/mediaRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import contactRoutes from './routes/contactRoutes.js';


// import path from "path";


// // dotenv.config();


// const app = express();
// const PORT = process.env.PORT || 5000;



// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: 'Too many requests from this IP, please try again later'
// });

// app.use(helmet());
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true
// }));
// app.use(morgan('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('/api/', limiter);

// app.get('/api/health', (req, res) => {
//   res.json({
//     status: 'ok',
//     message: 'Research Platform API is running',
//     timestamp: new Date().toISOString()
//   });
// });

// app.use('/api/auth', authRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api', categoryRoutes);
// app.use('/api/media', mediaRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/contact', contactRoutes);
// import imageCategoryRoutes from './routes/imageCategoryRoutes.js';
// app.use('/api/image-categories', imageCategoryRoutes);

// app.use((req, res) => {
//   res.status(404).json({ error: 'Route not found' });
// });

// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(err.status || 500).json({
//     error: err.message || 'Internal server error',
//     ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//   });
// });

// app.listen(PORT, async () => {
//   console.log(`
// ╔═══════════════════════════════════════════════════════╗
// ║   Research Platform API Server                        ║
// ║   Server running on: http://localhost:${PORT}           ║
// ║   Environment: ${process.env.NODE_ENV || 'development'}                          ║
// ║   Health check: http://localhost:${PORT}/api/health    ║
// ╚═══════════════════════════════════════════════════════╝
//   `);

//   try {
//     await runMigrations();
//     console.log('✓ Server is ready to handle requests\n');
//   } catch (error) {
//     console.error('✗ Failed to run migrations. Server may not work correctly.');
//     console.error('Error:', error.message);
//   }
// });

// export default app;


import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: "./.env" });
}

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { runMigrations } from './utils/migrationRunner.js';

import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import imageCategoryRoutes from './routes/imageCategoryRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Trust the first proxy (Render/Vercel)
app.set('trust proxy', 1);

/* ======================
   Rate Limiter
====================== */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});

/* ======================
   Middlewares
====================== */

app.use(helmet());

// Allow localhost + IP access
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', limiter);

/* ======================
   Health Check
====================== */

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Research Platform API is running',
    timestamp: new Date().toISOString()
  });
});

/* ======================
   Routes
====================== */

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', categoryRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/image-categories', imageCategoryRoutes);

/* ======================
   404 Handler
====================== */

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/* ======================
   Error Handler
====================== */

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

/* ======================
   Server Start
====================== */

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║   Research Platform API Server                        ║
║   Server running on port: ${PORT}                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}        ║
╚═══════════════════════════════════════════════════════╝
  `);

  try {
    await runMigrations();
    console.log('✓ Server is ready to handle requests\n');
  } catch (error) {
    console.error('✗ Failed to run migrations.');
    console.error('Error:', error.message);
  }
});

export default app;
