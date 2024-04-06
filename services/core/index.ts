import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { ioConfig } from './socket';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const server = http.createServer(app);

const io = new Server(server, {
  path: '',
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    allowedHeaders: ['Authorization'],
  },
  cleanupEmptyChildNamespaces: true,
});

ioConfig(io);

server.listen(5003, () => {
  console.log('Server is running on port 5000');
});

export default app;
