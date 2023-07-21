import {socketEvents} from '../commons/constants'

const usersArray: Set<string> = new Set();
const roomsArray: string[] = [];

export default (io) => {
  io.on("connection", (socket) => {

    const username: string = socket.handshake.query.username as string;

    socket.on(socketEvents.NEW_ROOM, ({ nameRoom }) => {
      if (roomsArray.includes(nameRoom)) {
        socket.emit(socketEvents.BAD_ROOM_NAME);
      } else {
        roomsArray.push(nameRoom);
        socket.emit(socketEvents.ADD_ROOM, nameRoom);
        socket.broadcast.emit(socketEvents.ADD_ROOM, nameRoom);
      }
    });

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
};
