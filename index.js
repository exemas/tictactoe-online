const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const router = require("./router");
const path = require("path");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const {
  addUser,
  removeUser,
  removeUserByID,
  getTurn,
  nextTurn,
  newGame,
} = require("./functions.js");

io.on("connect", (socket) => {
  console.log("Conexión establecida.");

  socket.on("getRoom", (room, callback) => {
    const roomExists = Object.keys(rooms).filter((element) => {
      return element === room;
    });
    if (roomExists.length > 0) {
      return callback(room);
    } else {
      return callback({ error: `La sala ${room} no existe.` });
    }
  });

  //Ingresa un usuario a una sala.
  socket.on("join", ({ name, room, img }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room, img });
    if (error) return callback(error); //Error, sino continúa
    socket.join(user.room);
    socket.broadcast.to(user.room).emit("roomData", user);
    const roomsAvailable = Object.keys(rooms).filter(
      (key) => key !== "roomStep"
    );
    socket.broadcast.emit("roomsAvailable", roomsAvailable);
    console.log(rooms);
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

  //Petición para saber que ID tiene el turno.
  socket.on("newGame", ({ room, squares }) => {
    console.log(`Nuevo Juego para sala ${room}`);
    const sendTurn = newGame(room);
    io.in(Object.values(socket.rooms)[0]).emit("sendTurn", sendTurn);
    io.in(Object.values(socket.rooms)[0]).emit("sendSquares", squares);
  });

  //Se desconecta un usuario de una sala.
  socket.on("leaveRoom", () => {
    const { roomData } = removeUser(socket, socket.id);
    const roomsAvailable = Object.keys(rooms).filter(
      (key) => key !== "roomStep"
    );
    socket.broadcast.emit("roomsAvailable", roomsAvailable);
    console.log(rooms);
  });

  //Se desconecta un usuario de una sala.
  socket.on("disconnect", () => {
    const roomData = removeUserByID(socket.id);
    socket.broadcast.to(roomData).emit("leave");
    const roomsAvailable = Object.keys(rooms).filter(
      (key) => key !== "roomStep"
    );
    socket.broadcast.emit("roomsAvailable", roomsAvailable);
    console.log("Se desconectó usuario.");
  });

  socket.on("getRoomsAvailable", (data, callback) => {
    const roomsAvailable = Object.keys(rooms).filter(
      (key) => key !== "roomStep"
    );
    return callback(roomsAvailable);
  });
});

app.use(cors());
//app.use(router);
app.use(express.static(path.join(__dirname, "build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);
//
