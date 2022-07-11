module.exports = {
    recordEducativo: function (io, conn) {
        io.on('connection', async function (socket) {
            //Variables
            const requestData = socket.handshake.query;
            const { id_moodle, id_plan_estudio, anio_actual, mes_actual } = requestData;

            console.log("alumno conectado");

            //Listeners
            socket.on('getData', function (data) {
                let query = `CALL escolar.sp_record_educativo(${id_moodle},${id_plan_estudio},${mes_actual},${anio_actual});`;

                conn.invokeQuery(query, function(results) {
                    socket.emit('printData', results[0], results[1]);
                });
            })

            socket.on('disconnect', function(data) {
                console.log("Here save data from active pages and hours");
            });
        });
    }
};