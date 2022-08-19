module.exports = {
    clicks: function (io, conn) {
        io.on("connection", async function(socket) {
            console.log("Soy clicks");
        });
    }
};