const rooms: string[] = [];
const roomsMap = new Map(rooms.map((roomId) => [roomId, 0]));

const getCurrentRoomId = (socket) =>
  rooms.find((roomId) => socket.rooms.has(roomId));

export default (io) => {
  io.on("connection", (socket) => {
    console.log('room');
    const roomName: string = socket.handshake.query.roomName as string;
    console.log(roomName);
    rooms.push(roomName)
    console.log(rooms);
    
    
    
    socket.emit("UPDATE_ROOMS", rooms);

    // socket.on("JOIN_ROOM", (roomId) => {
    //   const prevRoomId = getCurrentRoomId(socket);

    //   if (roomId === prevRoomId) {
    //     return;
    //   }
    //   if (prevRoomId) {
    //     socket.leave(prevRoomId);
    //   }

    //   socket.join(roomId);
    //   const counterValue = roomsMap.get(roomId);
    //   io.to(socket.id).emit("JOIN_ROOM_DONE", { counterValue, roomId });
    // });

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
