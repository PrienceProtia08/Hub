const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json()); // Middleware to parse JSON request bodies

// API endpoint to send a message
app.post('/api/messages', (req, res) => {
  const message = req.body.message;
  console.log('Received message:', message);
  io.emit('message', message);
  res.status(200).json({ message: 'Message sent' });
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
