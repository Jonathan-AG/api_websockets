let express = require("express");
let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);
let cors = require("cors");
global.mysql = require("mysql2");
let conn = require("./herramientas/connectionDB");
global.SSH2client = require("ssh2").Client;

/*Sockets*/
let socketSesiones = require("./src/sesiones");
let socketClicks = require("./src/clicks");

app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use((_req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-Requested-With, Accept, Content-Type, Origin, Cache-Control, X-File-Name');
	next();
});

//Start server
server.listen(app.get('port'), function() {
  console.log("listening on port: ", app.get('port'));
});

const sesiones = io.of("sesiones");
const clicks = io.of("clicks");

/*SESIONES*/
socketSesiones.sesionesActivas(sesiones, conn);

/*CONTEO DE CLICKS*/
socketClicks.clicks(clicks, conn);

/*PRUEBAS*/