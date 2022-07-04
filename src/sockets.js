module.exports = {
    example: function (io) {
        io.on('connection', async function (socket) {  
            socket.emit('socket:id', socket.id);
        })
    }
};