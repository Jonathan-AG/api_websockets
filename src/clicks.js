var moment = require('moment-timezone');

module.exports = {
    countClicks: function (io, conn) {
        io.on("connection", async function(socket) {
            const usuario = socket.handshake.query;

            socket.on("click", function(values) {
                let created_at = moment().tz('America/Mazatlan').format("YYYY/MM/DD HH:mm:ss");

                let query = `
                    CALL escolar.sp_setClicks(${usuario.id_plan_estudio}, ${usuario.id_moodle}, '${values.origen}', '${values.valor_origen}', '${created_at}');
                `;

                conn.invokeQuery(query, function(results) {
                    //console.log(results);
                });
            });
        });
    }
};