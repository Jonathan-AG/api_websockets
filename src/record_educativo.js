module.exports = {
    function: function (io, server) {
        io.on('connection', async function (socket) {
            //Querys
            /*let query = `SELECT id, basededatos FROM escolar.tb_plan_estudio WHERE id = 22;`;

            conn.invokeQuery(query, function(results) {
                console.log(results);
            });*/

            //TEST
            //console.log("Moment, Status: FAILED");

            //Variables
            let activatePages = [];

            //Listeners
            socket.on('sendData', async function (data) {
                console.log("ID Moodle from session is: " + data);
            });

            /*socket.on('disconnect', async function () {
                console.log("Socket disconnected");
                console.log("Save data");
            })*/

            //Emitters
            socket.emit('example', { server: "localhost", port: 3000 });
        });
    }
};