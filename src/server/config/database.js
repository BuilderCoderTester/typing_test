// server/config/database.js
import Pool from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Render PostgreSQL
    }
});

// Test connection
pool.on('connect', () => {
    console.log('✅ Connected to Render PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ PostgreSQL error:', err);
});

export default pool;