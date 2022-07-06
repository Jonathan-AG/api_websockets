module.exports = {
    messages: function (io) {
        io.on('connection', async function (socket) {
            //Variables

            //Listeners
            socket.on('activePage', async function (activePage) {
                console.log("Active page is: " + activePage);
            });

            //Emitters
        });
    }
};