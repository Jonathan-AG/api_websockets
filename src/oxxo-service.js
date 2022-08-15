module.exports = {
    anotherService: function (io, conn) {
        let space = io.of('/oxxoService');

        space.on("connection", async function(socket) {
            const data = socket.handshake.query;
            const oxxoSocket = socket.id;

            console.log("--------------------------------");
            console.log("Connected only oxxo plataform");
            console.log("OxxoSocket: " + oxxoSocket);
            console.log("Oxxo data: " + JSON.stringify(data));
            console.log("--------------------------------");

            space.emit("only oxxo", "Sended by service oxxo");
        });
    }
};