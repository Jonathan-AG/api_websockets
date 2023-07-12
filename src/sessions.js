import moment from "moment-timezone";

const activeSessionsSocket = (io, dbConnection) => {
    const users = [];
    const querySetSesiones = `CALL escolar.sp_setSesiones(?,?,?,?,?,?,?,?,?,?)`;

    io.on('connection', async (socket) => {
        const user = socket.handshake.query,
            sessionID = socket.id,
            timeToConnection = moment().tz('America/Mazatlan').format("YYYY/MM/DD HH:mm:ss")
        let userLogin = 0,
            room = `${user.id_moodle}-${user.id_plan_estudio}`;
        const rooms = socket.rooms;

        socket.join(room);

        socket.on('userLogout', () => {
            users[user.id_moodle].isLogout = true;
        });

        if (!users[user.id_moodle]) {
            users[user.id_moodle] = {
                activeExams: []
            };
            userLogin = 1;
        };

        if (room && rooms.has(sessionID)) {
            users[user.id_moodle].activeExams.push({
                id_sesion: sessionID,
                tipo: user.tipo,
                navegador: user.navegador,
                version_so: user.version_so,
                ip: user.ip
            });
        };

        socket.emit("activeExams", users[user.id_moodle].activeExams);

        socket.on('disconnect', async () => {
            const timeToDisconnection = moment().tz('America/Mazatlan').format("YYYY/MM/DD HH:mm:ss");

            if (room && rooms.has(sessionID)) {
                if (user.tipo == 2) {
                    socket.to(room).emit('reloadExam', user.tipo);
                }
                /* const queryParams = [
                    user.id_moodle,
                    user.id_plan_estudio,
                    timeToConnection,
                    timeToDisconnection,
                    user.tipo,
                    user.ip,
                    user.navegador,
                    user.version_so,
                    user.pagina_activa,
                    userLogin
                ]; */

                /* try {
                    await dbConnection.executeQuery(querySetSesiones, queryParams);
                } catch (error) {
                    console.log(error);
                } */

                console.log("GUARDA");
            }

            if (users[user.id_moodle].activeExams) {
                users[user.id_moodle].activeExams = users[user.id_moodle].activeExams.filter(session => session.id_sesion !== sessionID);

                socket.emit("activeExams", users[user.id_moodle].activeExams);
            }
        });
    });
};

export default activeSessionsSocket;