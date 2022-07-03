module.exports = {
    example: function (io) {
        io.on('connection', async function (socket) {  
            console.log("Working Socket, Socket: " + socket.id);
        })
    }
};