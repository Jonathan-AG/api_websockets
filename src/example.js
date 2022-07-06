module.exports = {
    test: function (io) {
        io.on('connection', async function (socket) {
            //Variables

            //Listeners
            socket.on('disconnect', async function (number) {
                console.log("Number: " + number);
            });

            //Emitters
            socket.emit('messages', messages);
        });
    }
};