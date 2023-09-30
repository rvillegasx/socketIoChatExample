const app = require('express')();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
const path = require('path')

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

http.listen(port, host, () => {
  console.log(`Socket.IO server running at http://${host}:${port}/`);
});

app.get('/test', (req, res) => {
  res.send('hello world');
});

app.post('/msg', (req, res) => {
  const msg = req.body.msg;
  if (msg) {
    res.send('ok');
    io.emit('chat message', msg);
  }
});