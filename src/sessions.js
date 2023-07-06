import moment from "moment-timezone";

const activeSessionsSocket = (io, dbConnection) => {
    let allSessions = [];

    io.on('connection', async (socket) => {
        const user = socket.handshake.query,
            sessionID = socket.id;
        let isLogin = 0;
        let room = `${user.userID}-${user.studyProgramID}`;

        socket.join(room);

        socket.on('userLogout', () => {
            allSessions[user.userID].isLogout = true;
        });

        if (!allSessions[user.userID] || allSessions[user.userID].isLogout) {
            allSessions[user.userID] = {
                id_moodle: user.userID,
                id_plan_estudio: user.id_plan_estudio,
                activeSessions: [],
                login: moment().tz('America/Mazatlan').format("YYYY/MM/DD HH:mm:ss"), 
                isLogout: false
            };
            isLogin = 1
        }

        allSessions[user.userID].activeSessions.push({
            loginUpdate: moment().tz('America/Mazatlan').format("YYYY/MM/DD HH:mm:ss"),
            typeSession: user.type,
            sessionID: sessionID,
            ipAddress: user.ip,
            browser: user.browser,
            operatingSystem: user.os,
            currentPage: user.activePage,
            isLogin: isLogin
        });

        const activeSockets = Object.values(allSessions)
            .flatMap(userSessions => userSessions.activeSessions.map(session => session.sessionID));

        socket.emit("saveSession", {
            session: allSessions[user.userID].activeSessions.at(-1)
        });

        socket.to(room).emit("activeSockets", {
            activeSockets: activeSockets,
            allSessions: allSessions[user.userID].activeSessions
        });

        const QUERY_SET_SESSIONS = `CALL sp_setSesiones(?,?,?,?,?,?,?,?,?,?)`;

        socket.on('disconnect', async () => {
            let timeToDisconnection = moment().tz('America/Mazatlan').format("YYYY/MM/DD HH:mm:ss");
            const userSessions = allSessions[user.userID];

            userSessions.activeSessions.forEach(async(element) => {
                if (element.sessionID === sessionID) {
                    if (element.typeSession == 2) {
                        socket.to(room).emit("reloadExam", {
                            typeSession: element.typeSession,
                            currentPage: element.currentPage
                        });
                    }

                    const QUERY_PARAMS = [
                        user.userID,
                        user.studyProgramID,
                        element.loginUpdate,
                        timeToDisconnection,
                        element.typeSession,
                        element.ipAddress,
                        element.browser,
                        element.operatingSystem,
                        element.currentPage,
                        element.isLogin
                    ];

                    await dbConnection.executeQuery(QUERY_SET_SESSIONS, QUERY_PARAMS);
                }
            });

            if (userSessions) {
                userSessions.activeSessions = userSessions.activeSessions.filter(session => session.sessionID !== sessionID);
                const remainingSockets = userSessions.activeSessions.map(session => session.sessionID);

                socket.to(room).emit("activeSockets", {
                    activeSockets: remainingSockets,
                    allSessions: userSessions.activeSessions
                });
            }
        });
    });
};

export default activeSessionsSocket;