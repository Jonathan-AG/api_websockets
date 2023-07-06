import express from 'express';
import http from "http";
import { Server } from 'socket.io';
import DotenvConfigOptions from 'dotenv';
import DatabaseSingleton from './tools/databaseSingleton.js';
import activeSessionsSocket from './src/sessions.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const dbSingleton = new DatabaseSingleton();
const session = io.of("sessions");
const usedMemory = process.memoryUsage();

if (process.env.NODE_ENV !== 'production') {
  DotenvConfigOptions.config();
}

activeSessionsSocket(session, dbSingleton);

app.get("/hello", function(req, res) {
  res.status(200).send("Hello, world!");
});

app.get("/memory", function(req, res) {
  res.status(200).send(usedMemory);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("file: main.js ~ port:", port)
});
