let express = require("express");
let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);

let messages = [
    {
      author: "Carlos",
      text: "Hola! que tal?",
    },
    {
      author: "Pepe",
      text: "Muy bien! y tu??",
    },
    {
      author: "Paco",
      text: "Genial!",
    },
];

io.on("connection", function (socket) {
    console.log("Un cliente se ha conectado");
    socket.emit("messages", messages);
});

server.listen(3000, function() { 
    console.log("listening on port 3000");
});