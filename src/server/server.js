import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pkg from 'pg';
const { Pool } = pkg;

// Import routes
import resultsRouter from './routes/results.js';
import leaderboardRouter from './routes/leaderboard.js';
import textRouter from './routes/text.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// PostgreSQL Pool (Render)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.on('connect', () => console.log('✅ PostgreSQL connected'));
pool.on('error', (err) => console.error('❌ PostgreSQL error:', err));

app.locals.pool = pool;

// CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? true : 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api/results', resultsRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/text', textRouter);

// Health check
app.get('/api/health', async (req, res) => {
    try {
        const dbCheck = await pool.query('SELECT NOW()');
        res.json({ status: 'OK', database: 'Connected', timestamp: dbCheck.rows[0].now });
    } catch (err) {
        res.status(500).json({ status: 'Error', database: 'Disconnected', error: err.message });
    }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    // Go up 2 levels: src/server → src → root → dist
    app.use(express.static(join(__dirname, '../../dist')));
    
    app.get('*', (req, res) => {
        res.sendFile(join(__dirname, '../../dist', 'index.html'));
    });
}

// Local dev
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
}

export default app;