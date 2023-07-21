import { Server } from "socket.io";
import * as config from "./config";

import allRooms from "./allRooms";
import room from "./room";

export default (io: Server) => {
  allRooms(io.of("/all-rooms"));
  room(io.of("/room"));
};
