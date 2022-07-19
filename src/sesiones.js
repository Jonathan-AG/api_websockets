var moment = require('moment-timezone');

module.exports = {
    sesionesActivas: function (io, conn) {
        let usuarios = [];

        io.on("connection", async function(socket) {
            const usuario = socket.handshake.query;
            const id_sesion = socket.id;

            socket.join(usuario.id_moodle);

            //guarda el inicio de sesion
            if (!usuarios[usuario.id_moodle]) {
                usuarios[usuario.id_moodle] = { id_moodle: usuario.id_moodle, id_plan_estudio: usuario.id_plan_estudio, sesiones_activas: [], login: moment().tz('America/Mazatlan').format("YYYY/MM/DD HH:mm:ss"), pagina_activa: usuario.pagina_activa };
            }

            usuarios[usuario.id_moodle].sesiones_activas.push({ login: moment().tz('America/Mazatlan').format("YYYY/MM/DD HH:mm:ss"), tipo: usuario.tipo, id_sesion: id_sesion, ip: usuario.ip, navegador: usuario.navegador, version_so: usuario.version_so });

            socket.to(usuario.id_moodle).emit("examenes_activos", usuarios[usuario.id_moodle].sesiones_activas);
            //socket.emit("examenes_activos", usuarios[usuario.id_moodle].sesiones_activas);

            socket.on('disconnect', function() {
                let a = '';
                let b = moment().tz('America/Mazatlan').format("YYYY/MM/DD HH:mm:ss");

                var conexiones = [];

                console.log(usuarios[usuario.id_moodle].pagina_activa);
                //console.log(usuarios[usuario.id_moodle].sesiones_activas);

                for (let [index, log] of usuarios[usuario.id_moodle].sesiones_activas.entries()) {
                    if (log.id_sesion == id_sesion) {
                        a = log.login

                        if ((usuarios[usuario.id_moodle].sesiones_activas.length - 1) == 0 || log.tipo == 2) {
                            var query = `
                                CALL escolar.sp_setSesion(${usuario.id_moodle},${usuario.id_plan_estudio},'${usuarios[usuario.id_moodle].login}','${b}','${log.tipo}','${log.ip}','${log.navegador}','${log.version_so}')
                            `;

                            /*conn.invokeQuery(query, function(results) {
                                //console.log(results)
                            });*/
                            console.log("Save data to database");
                        }
                    } else {
                        conexiones.push(log);
                    }
                }

                //usuarios[usuario.id_moodle].sesiones_activas = conexiones
                //console.log(usuarios[usuario.id_moodle].sesiones_activas)
            });
        });
    }
};