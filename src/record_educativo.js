module.exports = {
    recordEducativo: function (io, conn) {
        io.on('connection', async function (socket) {
            console.log("Socket record educativo");
        });
    }
};