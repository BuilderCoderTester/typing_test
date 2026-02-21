// server/routes/text.js
import express from 'express';
const router = express.Router();

// GET random text
router.get('/', async (req, res) => {
    try {
        const { pool } = req.app.locals;
        const { difficulty } = req.query;
        
        const result = await pool.query(
            'SELECT content FROM texts WHERE difficulty = $1 ORDER BY RANDOM() LIMIT 1',
            [difficulty || 'medium']
        );
        
        const text = result.rows[0] ? result.rows[0].content : 
            'The quick brown fox jumps over the lazy dog.';
        
        res.json({ text });
    } catch (error) {
        console.error('Error fetching text:', error);
        res.status(500).json({ error: 'Failed to fetch text' });
    }
});

export default router;