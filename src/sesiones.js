let moment = require('moment');

module.exports = {
    sesionesActivas: function (io, connection) {
        let usuarios = [];

        io.on("connection", async function(socket) {
            console.log("Socket sesiones");

            const usuario = socket.handshake.query;
            const id_sesion = socket.id;

            socket.join(usuario.id_moodle);
            //console.log("alumno conectado");

            //guarda el inicio de sesion
            if (!usuarios[usuario.id_moodle]) {
                usuarios[usuario.id_moodle] = { id_moodle: usuario.id_moodle, numero_empleado: usuario.numero_empleado, id_plan_estudio: usuario.id_plan_estudio, sesiones_activas: [], login: moment().format("YYYY/MM/DD hh:mm:ss") };
            }

            usuarios[usuario.id_moodle].sesiones_activas.push({ login: moment().format("YYYY/MM/DD hh:mm:ss"), tipo: usuario.tipo, id_sesion: id_sesion, ip: usuario.ip, navegador: usuario.navegador, so: usuario.so, version_so: usuario.version_so });

            socket.to(usuario.id_moodle).emit("examenes_activos", usuarios[usuario.id_moodle].sesiones_activas);
            //socket.emit("examenes_activos", usuarios[usuario.id_moodle].sesiones_activas);

            socket.on('disconnect', function() {
                let a = 'as';
                let b = moment().format("YYYY/MM/DD hh:mm:ss");

                var conexiones = [];

                for (let [index, log] of usuarios[usuario.id_moodle].sesiones_activas.entries()) {
                    if (log.id_sesion == id_sesion) {
                        a = log.login
                            //usuarios[usuario.id_moodle].sesiones_activas.splice(index);

                        if (usuarios[usuario.id_moodle].sesiones_activas.length == 0) {
                            var query = `
                                CALL escolar.sp_setSesion(${usuario.id_moodle},${usuario.id_moodle},${usuario.id_plan_estudio},'${usuarios[usuario.id_moodle].login}','${b}')
                            `;

                            connection.invokeQuery(query, function(results) {
                                //console.log(results)
                            });
                        }
                    } else {
                        conexiones.push(log);
                    }
                }

                usuarios[usuario.id_moodle].sesiones_activas = conexiones;
                //console.log(usuarios[usuario.id_moodle].sesiones_activas)
            });
        });
    }
};