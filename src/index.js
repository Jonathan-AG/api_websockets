import express from 'express';
import { Server as WebSocketServer } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new WebSocketServer(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', async (socket) => {
    console.log("New conection");

    const idSession = socket.id;

    socket.emit('exampleEvent', idSession);

    socket.on('resEvent', (data) => {
        console.log("Listening res event!, ", data);
    });
});
//LOG Versiones
/*app.get('/', (req, res) => {
    res.send("V001 - D02062022");
})*/

server.listen(3000);