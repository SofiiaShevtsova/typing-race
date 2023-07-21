import { log } from "console";
// використай Set
const usersArray: Set<string> = new Set();

export default (io) => {
  io.on("connection", (socket) => {
    const username: string = socket.handshake.query.username as string;

    if (usersArray.has(username)) {
      socket.emit("BAD_USER_NAME");
    } else {
      usersArray.add(username);
      socket.on("disconnect", () => {
        usersArray.delete(username);
      });
    }
  });
};
