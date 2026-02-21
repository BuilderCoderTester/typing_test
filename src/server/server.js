// server/server.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pkg from 'pg';
const { Pool } = pkg;

// Import routes
import resultsRouter from './routes/results.js';
import leaderboardRouter from './routes/leaderboard.js';
import textRouter from './routes/text.js';

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// PostgreSQL Pool (Render)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Render PostgreSQL
    }
});

// Test DB connection
pool.on('connect', () => {
    console.log('✅ Connected to Render PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ PostgreSQL error:', err);
});

// Make pool available to routes
app.locals.pool = pool;

// CORS - Allow Vercel frontend
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [
        'https://your-app.vercel.app',
        'https://your-app-git-main-yourname.vercel.app',
        // Add any other Vercel preview URLs
      ]
    : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api/results', resultsRouter);
// app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/text', textRouter);

// Health check with DB status
app.get('/api/health', async (req, res) => {
    try {
        const dbCheck = await pool.query('SELECT NOW()');
        res.json({ 
            status: 'OK', 
            database: 'Connected',
            timestamp: dbCheck.rows[0].now
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'Error', 
            database: 'Disconnected',
            error: err.message
        });
    }
});

// Serve static files in production (Vercel)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(join(__dirname, '../client/build')));
    
    app.get('*', (req, res) => {
        res.sendFile(join(__dirname, '../client/build', 'index.html'));
    });
}

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error!' });
});

// Start server (local dev only)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
}

// Export for Vercel serverless
export default app;