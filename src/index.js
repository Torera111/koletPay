import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import invoiceRoutes from "./routes/invoice.routes.js";
 
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/v1/invoices',  invoiceRoutes)

const PORT = process.env.PORT || 5000;
console.log(process.env.PORT)
app.listen(PORT, () => console.log(`Server sprinting on port ${PORT}`));

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

const app = express();

const PORT = Number(process.env.PORT) || 5000;

// Allow the Next.js frontend to communicate with this backend.
const allowedOrigins = (
  process.env.CLIENT_URL || 'http://localhost:3000'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header can include server-to-server requests.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// Parse incoming JSON with a reasonable request-size limit.
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Basic API health check.
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'KoletPay API is running',
  });
});

// Handle unknown endpoints.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Central error handler.
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error('API error:', err.message);

  const status =
    err.status ||
    (err.message.startsWith('CORS blocked') ? 403 : 500);

  res.status(status).json({
    success: false,
    message:
      status === 403
        ? 'This frontend origin is not allowed.'
        : status < 500
          ? err.message
          : 'Internal server error',
  });
});

// Connect to MongoDB before accepting requests.
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`KoletPay API running at http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start KoletPay API:', error.message);
  process.exit(1);
});
