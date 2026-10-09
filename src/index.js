import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import invoiceRoutes from './routes/invoice.routes.js';
import authRoutes from './routes/auth.routes.js';
import customerRoutes from './routes/customer.routes.js';
import productRoutes from './routes/product.routes.js';

const PORT = Number(process.env.PORT) || 5000;

function getAllowedOrigins() {
  const configured = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

  if (process.env.NODE_ENV === 'production' && configured.length === 0) {
    throw new Error('CLIENT_URL must define allowed frontend origins in production');
  }

  return configured.length > 0 ? configured : ['http://localhost:3000'];
}

export const app = express();

const allowedOrigins = getAllowedOrigins();

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

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'KoletPay API is running',
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/invoices', invoiceRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

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

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`KoletPay API running at http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  startServer().catch((error) => {
    console.error('Failed to start KoletPay API:', error.message);
    process.exit(1);
  });
}
