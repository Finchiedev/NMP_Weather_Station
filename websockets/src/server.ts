import express from 'express';
import dgram from 'dgram';
import * as WebSocket from 'ws';
import * as http from 'http';

const app = express();
const httpServer = http.createServer(app);

const wss = new WebSocket.Server({ server: httpServer });

httpServer.listen(5001, () => {
  console.log(`Server listening on port ${httpServer.address()}`);
});

const socket = dgram.createSocket('udp4');
socket.bind(5000);

socket.on('message', (msg, rinfo) => {
  // const data = JSON.parse(msg.toString());
  console.log(`Forwarding: ${msg} from ${rinfo.address}:${rinfo.port}`);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
});