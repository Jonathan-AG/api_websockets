let express = require("express");
let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server, {
  cors: {
    origin: "*",
  }
});
let socketExams = require("./src/sockets");
let example = require("./src/example");

//Settings
app.set('port', process.env.PORT || 3000);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

//Start server
server.listen(app.get('port'), function() {
  console.log("listening on port: ", app.get('port'));
});

//WebSockets
socketExams.example(io);
example.messages(io);