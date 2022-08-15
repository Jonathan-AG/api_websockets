var moment = require('moment-timezone');

module.exports = {
    sesionesActivas: function (io, conn) {
        let usuarios = [];

        io.on("connection", async function(socket) {
            const usuario = socket.handshake.query;
            const id_sesion = socket.id;

            socket.join(usuario.id_moodle);

            //GUARDA EL INICIO DE SESION
            if (!usuarios[usuario.id_moodle] || usuarios[usuario.id_moodle].isLogout) {
                usuarios[usuario.id_moodle] = { id_moodle: usuario.id_moodle, id_plan_estudio: usuario.id_plan_estudio, sesiones_activas: [], login: moment().tz('America/Mazatlan').format("YYYY/MM/DD HH:mm:ss"), isLogout: false };
            }

            //ESCUCHA SI EL USUARIO A CERRADO SESION EN LA PLATAFORMA
            socket.on("logout", function () {
                usuarios[usuario.id_moodle].isLogout = true;
            });

            //GUARDA LAS SESIONES ACTIVAS DEL USUARIO
            usuarios[usuario.id_moodle].sesiones_activas.push({ login_update: moment().tz('America/Mazatlan').format("YYYY/MM/DD HH:mm:ss"), tipo: usuario.tipo, id_sesion: id_sesion, ip: usuario.ip, navegador: usuario.navegador, version_so: usuario.version_so, pagina_activa: usuario.pagina_activa });

            //EVENTO PARA CHECAR EXAMENES ACTIVOS
            socket.to(usuario.id_moodle).emit("examenes_activos", usuarios[usuario.id_moodle].sesiones_activas);
            //socket.emit("examenes_activos", usuarios[usuario.id_moodle].sesiones_activas);


            //ESCUCHA LA DESCONEXION DEL SOCKET
            socket.on('disconnect', function() {
                let a = '';
                let b = moment().tz('America/Mazatlan').format("YYYY/MM/DD HH:mm:ss");

                var conexiones = [];

                for (let [index, log] of usuarios[usuario.id_moodle].sesiones_activas.entries()) {
                    if (log.id_sesion == id_sesion) {
                        a = log.login_update;

                        //GUARDA SESIONES DE LOS ALUMNOS
                        let query = `
                            CALL escolar.sp_setSesiones(${usuario.id_moodle},${usuario.id_plan_estudio},'${a}','${b}','${log.tipo}','${log.ip}','${log.navegador}','${log.version_so}','${usuario.pagina_activa}')
                        `;

                        conn.invokeQuery(query, function(results) {
                            //console.log(results)
                        });

                        //GUARDA ULTIMA SESION DEL ALUMNO
                        if ((usuarios[usuario.id_moodle].sesiones_activas.length - 1) == 0 || log.tipo == 2) {
                            let query = `
                                CALL escolar.sp_setUltimaSesion(${usuario.id_moodle},${usuario.id_plan_estudio},'${usuarios[usuario.id_moodle].login}','${b}','${log.tipo}','${log.ip}','${log.navegador}','${log.version_so}')
                            `;

                            conn.invokeQuery(query, function(results) {
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