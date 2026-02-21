import pool from '../config/database.js';

class Result {

    static async create(resultData) {
        const { username, wpm, accuracy, time_taken, words_typed, errors } = resultData;

        const [result] = await pool.execute(
            `INSERT INTO results 
             (username, wpm, accuracy, time_taken, words_typed, errors) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [username, wpm, accuracy, time_taken, words_typed, errors]
        );

        return result.insertId;
    }

    static async getAll(limit = 50) {
        const safeLimit = Number(limit) || 50;

        const [rows] = await pool.query(
            `SELECT * 
             FROM results 
             ORDER BY wpm DESC, accuracy DESC 
             LIMIT ${safeLimit}`
        );

        return rows;
    }

    static async getByUsername(username) {
        const [rows] = await pool.execute(
            `SELECT * 
             FROM results 
             WHERE username = ? 
             ORDER BY created_at DESC`,
            [username]
        );

        return rows;
    }

    static async getLeaderboard(limit = 10) {
        const safeLimit = Number(limit) || 10;

        const [rows] = await pool.query(
            `SELECT username,
                    MAX(wpm) AS best_wpm,
                    AVG(wpm) AS avg_wpm,
                    AVG(accuracy) AS avg_accuracy,
                    COUNT(*) AS tests_taken
             FROM results
             GROUP BY username
             ORDER BY best_wpm DESC
             LIMIT ${safeLimit}`
        );

        return rows;
    }

    static async getRandomText(difficulty = 'medium') {
        const [rows] = await pool.execute(
            `SELECT content 
             FROM texts 
             WHERE difficulty = ? 
             ORDER BY RAND() 
             LIMIT 1`,
            [difficulty]
        );

        return rows.length > 0
            ? rows[0].content
            : 'The quick brown fox jumps over the lazy dog.';
    }
}

export default Result;