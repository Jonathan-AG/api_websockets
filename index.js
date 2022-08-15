let express = require("express");
let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);
global.mysql = require("mysql2");
let conn = require("./herramientas/connectionDB");
global.SSH2client = require("ssh2").Client;

/*Sockets*/
let socketSesiones = require("./src/sesiones");

//Settings
app.set('port', process.env.PORT || 8080);
/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});*/

//Start server
server.listen(app.get('port'), function() {
  console.log("listening on port: ", app.get('port'));
});

const sesiones = io.of("sesiones");
const clicks = io.of("clicks");

/*SESIONES*/
socketSesiones.sesionesActivas(sesiones, conn);

/*PRUEBAS*/