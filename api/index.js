// Vercel Serverless Function for Backend API
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

// Get all items
app.get('/api/items/all', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM items');
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add item
app.post('/api/items/add', async (req, res) => {
  try {
    const { title, description, category, location, type } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO items (title, description, category, location, type, status, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, category, location, type, 'MATCHED', 1]
    );
    await connection.end();
    res.json({ id: result.insertId, title, description, category, location, type });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Auth endpoints (simplified)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    await connection.end();
    
    if (rows.length > 0) {
      const user = rows[0];
      res.json({
        token: 'simple-token-' + Date.now(),
        type: 'Bearer',
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    
    // Check if user exists
    const [existing] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      await connection.end();
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Create user
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, 'USER']
    );
    await connection.end();
    
    res.json({
      token: 'simple-token-' + Date.now(),
      type: 'Bearer',
      id: result.insertId,
      name,
      email,
      role: 'USER'
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = app;
