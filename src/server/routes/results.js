// src/server/routes/results.js
import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { pool } = req.app.locals;
        const result = await pool.query('SELECT * FROM results ORDER BY wpm DESC LIMIT 50');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/user/:username', async (req, res) => {
    try {
        const { pool } = req.app.locals;
        const result = await pool.query(
            'SELECT * FROM results WHERE username = $1 ORDER BY created_at DESC',
            [req.params.username]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { pool } = req.app.locals;
        const { username, wpm, accuracy, time_taken, words_typed, errors } = req.body;
        
        const result = await pool.query(
            `INSERT INTO results (username, wpm, accuracy, time_taken, words_typed, errors) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [username, wpm, accuracy, time_taken, words_typed, errors]
        );
        
        res.status(201).json({ id: result.rows[0].id, message: 'Saved' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;