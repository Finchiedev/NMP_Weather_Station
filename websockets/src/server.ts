import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dgram from 'dgram';

// ----------------- Set up a UDP socket -----------------
const socket = dgram.createSocket('udp4');
const data = Buffer.from('Some Data');

socket.bind(5000);
socket.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  });