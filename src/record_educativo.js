module.exports = {
    messages: function (io) {
        io.on('connection', async function (socket) {
            //Variables
            let activatePages = [];

            //Listeners
            socket.on('activePage', async function (activePage) {
                console.log("Active page is: " + activePage);
            });

            socket.on('disconnect', async function () {
                console.log("Socket disconnected");
                console.log("Save data");
            })

            //Emitters
        });
    }
};