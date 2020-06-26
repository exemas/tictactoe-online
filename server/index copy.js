const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const { addUser, removeUser, getTurn, nextTurn } = require("./functions.js");

io.on("connect", (socket) => {
    console.log("Conexión establecida.");

    //Ingresa un usuario a una sala.
    socket.on("join", ({ name, room, img }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room, img });
        if (error) return callback(error); //Error, sino continúa
        socket.join(user.room);
        socket.broadcast.to(user.room).emit("roomData", user);
        if (user) return callback(user);
    });

    //Petición para saber que ID tiene el turno.
    socket.on("getTurn", (room, callback) => {
        console.log(`Saber Turno de sala ${room}`);
        const sendTurn = getTurn(room);
        socket.to(Object.values(socket.rooms)[0]).emit("sendTurn", sendTurn);
    });

    //Petición para saber que ID tiene el turno.
    socket.on("nextTurn", ({ room, squares }) => {
        console.log(`Próximo Turno de sala ${room}`);
        const sendTurn = nextTurn(room);
        io.in(Object.values(socket.rooms)[0]).emit("sendTurn", sendTurn);
        io.in(Object.values(socket.rooms)[0]).emit("sendSquares", squares);
    });

    //Se desconecta un usuario de una sala.
    socket.on("leaveRoom", () => {
        const { roomData } = removeUser(socket.id);
        if (roomData) {
            socket
                .to(Object.values(socket.rooms)[0])
                .emit("roomData", roomData);
            //console.log("Un usuario abandonó la sala.");
            console.log(rooms);
        }
    });
});

app.use(cors());
app.use(router);

server.listen(process.env.PORT || 5000, () =>
    console.log(`Server has started.`)
);
