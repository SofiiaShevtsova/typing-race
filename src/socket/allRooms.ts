const usersArray: string[] = []

export default (io) => {
  io.on("connection", (socket) => {
    const username: string = socket.handshake.query.username as string;
      console.log(username);
      socket.emit('BAD_USER');

    // socket.emit("UPDATE_COUNTER", countValue);

    // socket.on("INCREASE_COUNTER", () => {
    //   countValue++;
    //   socket.emit("UPDATE_COUNTER", countValue);
    //   socket.broadcast.emit("UPDATE_COUNTER", countValue);
    // });

    socket.on("disconnect", () => {
      console.log(`${socket.id} disconnected`);
    });
  });
};
