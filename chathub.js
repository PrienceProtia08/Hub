// server.js
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// In-memory database for users
let users = [];

// Registration endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // Hash the password
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

  // Create a new user
  const newUser = { username, hash, salt };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Verify the password
  const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
  if (hash !== user.hash) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Generate a token or session ID and return it to the client
  const token = crypto.randomBytes(32).toString('hex');
  res.json({ token });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
