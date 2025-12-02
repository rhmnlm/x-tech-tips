//  = require('express');
import express from 'express';
// const morgan = require('morgan');
import morgan from 'morgan';

const app = express();
const PORT = 3000;

// Use morgan with 'dev' format for colored, concise output
app.use(morgan('dev'));

// Sample routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/users', (req, res) => {
  res.json({ users: ['Alice', 'Bob', 'Charlie'] });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});