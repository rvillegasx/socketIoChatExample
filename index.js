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

app.post('/msg', (req, res) => {
  res.set("Connection", "close");
  const msg = req.body.msg;
  if (msg) {
    res.status(200).send({ ok: true });
    io.emit('chat message', msg);
    res.end();
  } else {
    res.status(200).send({ ok: false });
    res.end();
  }
});