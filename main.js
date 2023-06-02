import express from 'express';
import http from "http";
import { Server } from "socket.io";
import DatabaseSingleton from './tools/databaseSingleton.js';
import activeSessionsSocket from "./src/sessions.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const dbSingleton = new DatabaseSingleton();
const session = io.of("session");

activeSessionsSocket(session, dbSingleton);

app.get("/hello", function(req, res) {
  res.status(200).send("Hello World!");
});


const port = 8080;
server.listen(port, () => {
  console.log(`Servidor Socket.io iniciado en el puerto ${port}`);
});
