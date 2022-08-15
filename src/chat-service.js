module.exports = {
    chatGeneral: function (io, conn) {
        let messages = [];

        let space = io.of('/chat-general');

        space.on("connection", async function(socket) {
            const data = socket.handshake.query;
            const generalSocket = socket.id;

            console.log("Connected general chat");

            space.on("send-chat-message", function(data) {
                messages.push(data);
            });

            space.emit("see-all-messages", messages);

            console.log(JSON.stringify(messages));
        });
    }
};