// server/routes/leaderboard.js
import express from 'express';
const router = express.Router();

// GET leaderboard
router.get('/', async (req, res) => {
    try {
        const { pool } = req.app.locals;
        const result = await pool.query(`
            SELECT 
                username, 
                MAX(wpm) as best_wpm, 
                ROUND(AVG(wpm)) as avg_wpm,
                ROUND(AVG(accuracy)) as avg_accuracy,
                COUNT(*) as tests_taken
            FROM results 
            GROUP BY username 
            ORDER BY best_wpm DESC 
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

export default router;