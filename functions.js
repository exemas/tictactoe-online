rooms = {};

const addUser = ({ id, name, room, img }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (!rooms.hasOwnProperty(room)) {
    rooms[room] = [];
  }

  if (!name || !room) return { error: "Se requiere Apodo y Sala." };
  if (rooms[room].length > 1) {
    return { error: "Esta sala ya se encuentra completa." };
  }
  const existingUser = rooms[room].filter((user) => user.name === name);
  if (existingUser.length > 0) {
    name = `${name}2`;
  }

  var step = -1;
  var type = "X";
  var player = 1;
  if (rooms[room].length > 0) {
    player = 2;
    step = Math.round(Math.random());
    if (rooms[room][0].type === "X") {
      type = "O";
    } else {
      type = "X";
    }
  }

  rooms["roomStep"] = { ...rooms["roomStep"], [room]: step };
  rooms[room].push({ id, name, img, room, type, player });
  const user = {
    id,
    name,
    img,
    room,
    type,
    player,
    currentRoom: rooms[room],
    roomStep: rooms["roomStep"][room],
  };

  console.log(`Ingresó ${name} (ID: ${id}) a sala ${room}`);
  return { user };
};

const removeUser = (socket) => {
  var roomData = {};
  Object.keys(rooms).forEach((key, index) => {
    if (key !== "roomStep") {
      delete rooms[Object.values(socket.rooms)[0]];
      delete rooms["roomStep"][Object.values(socket.rooms)[0]];
      console.log(rooms);
      socket.broadcast.to(Object.values(socket.rooms)[0]).emit("leave");
    }
  });
  return { roomData };
};

const removeUserByID = (id) => {
  var roomData = "";
  Object.keys(rooms).forEach((key, index) => {
    if (key !== "roomStep") {
      let foundID = rooms[key].findIndex((element) => element.id === id);
      if (foundID !== -1) {
        delete rooms[key];
        delete rooms["roomStep"][key];
        roomData = key;
        console.log(rooms);
      }
    }
  });
  return roomData;
};

const getTurn = (room) => {
  var turn = "";
  console.log(room);
  if (room !== "") {
    var step = rooms["roomStep"][room];
    if (typeof rooms[room][step % 2] !== "undefined") {
      if (rooms["roomStep"][room] !== -1) {
        turn = rooms[room][step % 2].id;
      }
    }
  }
  return turn;
};

const nextTurn = (room) => {
  var turn = "";
  if (room !== "") {
    var step = rooms["roomStep"][room];
    step = step + 1;
    rooms["roomStep"][room] = step;
    if (typeof rooms[room][step % 2] !== "undefined") {
      if (rooms["roomStep"][room] !== -1) {
        turn = rooms[room][step % 2].id;
      }
    }
  }
  return turn;
};

const newGame = (room) => {
  var turn = "none";
  if (room !== "") {
    const step = rooms["roomStep"][room] > 1 ? -1 : Math.round(Math.random());
    rooms["roomStep"][room] = step;
    console.log(step);
    if (typeof rooms[room][step % 2] !== "undefined") {
      turn = step !== -1 ? rooms[room][step % 2].id : "";
    }
  }
  console.log(turn);

  return turn;
};

module.exports = {
  addUser,
  removeUser,
  removeUserByID,
  getTurn,
  nextTurn,
  newGame,
};
