module.exports = {
    anotherService: function (io, conn) {
        let space = io.of('/prepaCoppelService');

        space.on("connection", async function(socket) {
            const data = socket.handshake.query;
            const coppelSocket = socket.id;

            console.log("--------------------------------");
            console.log("Connected only coppel plataform");
            console.log("CoppelSocket: " + coppelSocket);
            console.log("CoppelData: " + JSON.stringify(data));
            console.log("--------------------------------");

            space.emit("only coppel", "Sended by service coppel");
        });
    }
};