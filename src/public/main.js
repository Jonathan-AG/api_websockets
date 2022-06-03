const socket = io();

socket.on('exampleEvent', (data) => {
    console.log("Listening!, ", data);

    socket.emit('resEvent', { id: 1, name: "Alexis" });
})