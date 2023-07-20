import moment from "moment-timezone";
import fetch from "node-fetch";

const activeSessionsSocket = (io, dbConnection) => {
    const users = [];
    const indexStudyPrograms = [68,69,70,76,77,80,81,82];

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
            let urlService = '';
            const dataRes = {
                    idMoodle: user.id_moodle,
                    idPlanEstudio: user.id_plan_estudio,
                    timeToConnection: timeToConnection,
                    timeToDisconnection: timeToDisconnection,
                    tipo: user.tipo,
                    ip: user.ip,
                    navegador: user.navegador,
                    versionSO: user.version_so,
                    paginaActiva: user.pagina_activa,
                    userLogin: userLogin
            };

            if (indexStudyPrograms.includes(parseInt(user.id_plan_estudio))) {
                urlService = 'https://administrador.academiaglobal.mx/plataformas/api/php/services/setSession.service.php'
            } else {
                urlService = 'https://agcollege.edu.mx/api/php/services/setSession.service.php'
            }

            if (room && rooms.has(sessionID)) {
                if (user.tipo == 2) {
                    socket.to(room).emit('reloadExam', user.tipo);
                }

                try {
                    await fetch(urlService, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(dataRes)
                    });
                } catch (error) {
                    console.log(error);
                }
            }

            if (users[user.id_moodle].activeExams) {
                users[user.id_moodle].activeExams = users[user.id_moodle].activeExams.filter(session => session.id_sesion !== sessionID);

                socket.emit("activeExams", users[user.id_moodle].activeExams);
            }
        });
    });
};

export default activeSessionsSocket;