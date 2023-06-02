import moment from "moment-timezone";

const activeSessionsSocket = (io, dbConnection) => {
    let users = [];

    io.on('connection', async (socket) => {
        const user = socket.handshake.query,
            sessionID = socket.id;
        let userLogin = 0;

        socket.join(user.id_moodle);

        socket.on('userLogout', () => {
            users[user.id_moodle].isLogout = true;
        });

        if (!users[user.id_moodle] || users[user.id_moodle].isLogout) {
            users[user.id_moodle] = { id_moodle: user.id_moodle, id_plan_estudio: user.id_plan_estudio, activeSessions: [], login: moment().tz('America/Mazatlan').format("YYYY/MM/DD HH:mm:ss"), isLogout: false };
            userLogin = 1;
        }

        users[user.id_moodle].activeSessions.push({ login_update: moment().tz('America/Mazatlan').format("YYYY/MM/DD HH:mm:ss"), tipo: user.tipo, id_sesion: sessionID, ip: user.ip, navegador: user.navegador, version_so: user.version_so, pagina_activa: user.pagina_activa });

        socket.to(user.id_moodle).emit("activeExams", users[user.id_moodle].activeSessions);

        socket.on('disconnect', async () => {
            let a = '';
            let b = moment().tz('America/Mazatlan').format("YYYY/MM/DD HH:mm:ss");

            let connections = [];

            for (let [index, log] of users[user.id_moodle].activeSessions.entries()) {
                if (log.id_sesion == sessionID) {
                    a = log.login_update;

                    const query = `CALL escolar.sp_setSesiones(${user.id_moodle},${user.id_plan_estudio},'${a}','${b}','${log.tipo}','${log.ip}','${log.navegador}','${log.version_so}','${user.pagina_activa}', '${userLogin}')`;
                    const rows = await dbConnection.executeQuery(query);
                    console.log(rows);

                    if ((users[user.id_moodle].activeSessions.length - 1) == 0 || log.tipo == 2) {
                        const query = `CALL escolar.sp_setUltimaSesion(${user.id_moodle},${user.id_plan_estudio},'${users[user.id_moodle].login}','${b}','${log.tipo}','${log.ip}','${log.navegador}','${log.version_so}','${user.pagina_activa}')`;
                        const rows = await dbConnection.executeQuery(query);
                        console.log(rows);
                    }

                    if (log.tipo == 2) {
                        socket.to(user.id_moodle).emit('reloadExam', log.tipo);
                    }
                } else {
                    connections.push(log);
                }
            }

            users[user.id_moodle].activeSessions = connections;
        });

    });
};

export default activeSessionsSocket;