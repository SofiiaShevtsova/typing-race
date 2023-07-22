import { socketEvents } from "../commons/constants";
import { roomsArray, setRoomsArray, Room } from "./allRooms";

const checkRoomsList = (roomName: string): Room | undefined =>
  roomsArray.find((room: Room): boolean => room.roomName === roomName);

const getRoom = (username): Room | undefined =>
  roomsArray.find((room) => room.userList.includes(username));

export default (io) => {
  io.on("connection", (socket) => {
    socket.on(socketEvents.JOIN_ROOM, ({ roomName, username }) => {
      const prevRoom = getRoom(username);
      const currentRoom = checkRoomsList(roomName);

      currentRoom
        ? currentRoom.userList.push(username)
        : setRoomsArray([...roomsArray, { roomName, userList: [username] }]);

      if (roomName === prevRoom?.roomName) {
        return;
      }

      if (prevRoom) {
        socket.leave(socket.rooms);
        prevRoom.userList = prevRoom.userList.filter(
          (name: string): boolean => name !== username
        );
        if (prevRoom.userList.length === 0) {
          setRoomsArray(
            roomsArray.filter((room) => room.userList.length === 0)
          );
          io.emit(socketEvents.DELETE_ROOM, prevRoom);
        }
      }

      socket.join(roomName);
      setRoomsArray([...roomsArray]);

      io.to(socket.id).emit(socketEvents.JOINED_ROOM, {
        current: currentRoom,
        prev: prevRoom?.userList.length !== 0 && prevRoom,
        username,
      });

      io.emit(socketEvents.JOINED_ROOM, {
        current: currentRoom,
        prev: prevRoom?.userList.length !== 0 && prevRoom,
      });
    });

    socket.on(socketEvents.CHANGE_STATUS, ({ isReady, user }) => {
      socket.emit(socketEvents.CHANGE_STATUS_DONE, { isReady, user });
      socket.broadcast.emit(socketEvents.CHANGE_STATUS_DONE, { isReady, user });
    });
  });
};
