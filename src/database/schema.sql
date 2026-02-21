-- database/schema.sql (PostgreSQL version)
-- Create database manually in Vercel Dashboard or use default

-- Drop tables if exist (for clean setup)
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS texts;

-- Create results table
CREATE TABLE IF NOT EXISTS results (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    wpm INTEGER NOT NULL,
    accuracy DECIMAL(5,2) NOT NULL,
    time_taken INTEGER NOT NULL,
    words_typed INTEGER NOT NULL,
    errors INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create texts table
CREATE TABLE IF NOT EXISTS texts (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    difficulty VARCHAR(10) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample texts
INSERT INTO texts (content, difficulty, category) VALUES
('The quick brown fox jumps over the lazy dog. Programming is fun and challenging.', 'easy', 'general'),
('In computer science, a data structure is a data organization, management, and storage format that enables efficient access and modification.', 'medium', 'technology'),
('The art of debugging is figuring out what you really told your computer to do rather than what you thought you told it to do.', 'medium', 'programming'),
('Machine learning is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.', 'hard', 'technology');