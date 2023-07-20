import { Server } from "socket.io";
import * as config from "./config";

import counter from "./allRooms";
import counterWithRooms from "./createRoom";

export default (io: Server) => {
  counter(io.of("/all-rooms"));
  counterWithRooms(io.of("/room"));
};
