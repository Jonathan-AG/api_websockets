let express = require("express");
let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);

//Settings
app.set('port', process.env.PORT || 3000);

//Start server
server.listen(app.get('port'), function() {
  console.log("listening on port: ", app.get('port'));
});

//Variables
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

//WebSockets
io.on("connection", function (socket) {
    console.log("Un cliente se ha conectado");
    socket.emit("messages", messages);
});