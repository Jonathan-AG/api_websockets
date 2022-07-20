module.exports = {
    recordEducativo: function (io, conn) {
        io.on('connection', async function (socket) {
            console.log("Socket record educativo");
            //Variables
            const requestData = socket.handshake.query;
            const { id_moodle, id_plan_estudio } = requestData;

            /*console.log("alumno conectado");
            console.log("id_plan_estudio: " + id_plan_estudio);
            console.log("id_moodle: " + id_moodle);*/

            //Listeners
            socket.on('getData', function (data) {
                /*let query = `CALL escolar.sp_record_educativo(${id_moodle},${id_plan_estudio});`;

                conn.invokeQuery(query, async function(results) {
                    console.log(await results);
                    socket.emit('printData', results[0], results[1]);
                });*/
            })

            /*socket.on('disconnect', function(data) {
                console.log("Here save data from active pages and hours");
            });*/
        });
    }
};