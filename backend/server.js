  import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// ES6 __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging middleware
const logStream = fs.createWriteStream(
  path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: logStream }));
app.use(morgan('dev')); // Console logging in development

// ============================================================================
// ROUTES
// ============================================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Placeholder routes (we'll create these in next steps)
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Church Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      members: '/api/members',
      services: '/api/services',
      attendance: '/api/attendance',
      contributions: '/api/contributions',
      departments: '/api/departments'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_NAME = process.env.APP_NAME || 'Church Management System';

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║          ${APP_NAME.padEnd(55)} ║
║          Environment: ${NODE_ENV.padEnd(45)} ║
║          Server running on: http://localhost:${String(PORT).padEnd(40)} ║
║          Created by: JOSKA ALTAR                           ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;
