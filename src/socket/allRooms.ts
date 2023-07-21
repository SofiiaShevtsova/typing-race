import { socketEvents } from "../commons/constants";

type Room = {
  roomName: string;
  userList: string[];
};

const usersArray: Set<string> = new Set();
const roomsArray: Room[] = [];

const checkNameRoom = (nameRoom) =>
  roomsArray.find((room) => room.roomName === nameRoom);

export default (io) => {
  io.on("connection", (socket) => {
    socket.on(socketEvents.NEW_USER, (username) => {
      if (usersArray.has(username)) {
        socket.emit(socketEvents.BAD_USER_NAME);
      } else {
        usersArray.add(username);
        socket.emit(socketEvents.GET_ROOMS, roomsArray);
        socket.on("disconnect", () => {
          usersArray.delete(username);
        });
      }
    });

    socket.on(socketEvents.NEW_ROOM, (room) => {
      console.log(room);

      if (checkNameRoom(room.roomName)) {
        socket.emit(socketEvents.BAD_ROOM_NAME);
      } else {
        roomsArray.push(room);
        socket.emit(socketEvents.ADD_ROOM, room);
        socket.broadcast.emit(socketEvents.ADD_ROOM, room);
      }
    });
  });
};
