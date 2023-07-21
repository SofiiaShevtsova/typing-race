import { type } from "os";
import { socketEvents } from "../commons/constants";

type Room = {
  roomName: string;
  userList: string[];
};

// {roomName: '555', userList:['sofiia', 'frick']}

const rooms: Room[] = [];
// const roomsMap = new Map(rooms.map((room) => [room, 0]));
const checkRoomsList = (roomName) =>
  rooms.find((room) => room.roomName === roomName);

const getCurrentRoomName = (socket) =>
  rooms.find((room) => socket.rooms.has(room));

export default (io) => {
  io.on("connection", (socket) => {
    // console.log('room');
    // const roomName: string = socket.handshake.query.roomName as string;
    // console.log(roomName);
    // rooms.push(roomName)
    // console.log(rooms);

    socket.on(socketEvents.JOIN_ROOM, ({ roomName, username }) => {
      checkRoomsList(roomName)
        ? checkRoomsList(roomName)?.userList.push(username)
        : rooms.push({ roomName, userList: [username] });

      const prevRoomName = getCurrentRoomName(socket);

      if (roomName === prevRoomName) {
        return;
      }
      if (prevRoomName) {
        socket.leave(prevRoomName);
      }

      socket.join(roomName);
      console.log(rooms);
      

      // io.to(socket.id).emit(socketEvents.JOINED_ROOM, checkRoomsList(roomName));
    });

    // socket.on("INCREASE_COUNTER", () => {
    //   const currentRoomId = getCurrentRoomId(socket);
    //   if (currentRoomId) {
    //     const value = roomsMap.get(currentRoomId);
    //     if (value) {
    //       const newValue = value + 1;
    //       roomsMap.set(currentRoomId, newValue);
    //       io.to(currentRoomId).emit("UPDATE_COUNTER", newValue);
    //     }
    //   }
    // });
  });
};
