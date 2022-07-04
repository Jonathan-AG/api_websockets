module.exports = {
    messages: function (io, messages) {
        io.on('connection', async function (socket) {
            //Variables
            let messages = [],
                socketID = socket.id;

            messages.push({ID: socketID, message: 'New Connection'});

            //Listeners
            socket.on('example', async function (number) {
                console.log("Number: " + number);
            });

            //Emitters
            socket.emit('messages', messages);
        });
    }
};