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
    if (rooms[room].length > 0) {
        step = Math.round(Math.random());
        if (rooms[room][0].type === "X") {
            type = "O";
        } else {
            type = "X";
        }
    }

    rooms["roomStep"] = { ...rooms["roomStep"], [room]: step };
    rooms[room].push({ id, name, img, room, type });
    console.log(rooms);
    const user = {
        id,
        name,
        img,
        room,
        type,
        currentRoom: rooms[room],
        roomStep: rooms["roomStep"][room],
    };

    console.log(`Ingresó ${name} (ID: ${id}) a sala ${room}`);
    return { user };
};

const removeUser = (id) => {
    var roomData = {};
    Object.keys(rooms).forEach((key, index) => {
        if (key !== "roomStep") {
            let foundID = rooms[key].findIndex((element) => element.id === id);
            if (index !== -1 && rooms[key].length > 0) {
                //console.log(foundID);
                rooms[key].splice(foundID, 1); //Elimino a usuario del Room.
                roomData = { currentRoom: rooms[key] };
                if (rooms[key].length === 0) {
                    //console.log("room eliminado");
                    //delete rooms[key];
                }
            }
        }
    });
    return { roomData };
};

const getTurn = (room) => {
    var step = rooms["roomStep"][room];
    const turn = rooms[room][step % 2].id;
    return turn;
};

const nextTurn = (room) => {
    console.log("room: " + room);
    var turn = "";
    if (room !== "") {
        var step = rooms["roomStep"][room];
        step = step + 1;
        rooms["roomStep"][room] = step;
        if (typeof rooms[room][step % 2] !== "undefined") {
            turn = rooms[room][step % 2].id;
        }
    }
    return turn;
};

module.exports = { addUser, removeUser, getTurn, nextTurn };
