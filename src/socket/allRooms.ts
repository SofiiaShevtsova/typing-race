import { log } from "console";
import { socketEvents } from "../commons/constants";

export type Room = {
  roomName: string;
  userList: string[];
};

const usersArray: Set<string> = new Set();
export let roomsArray: Room[] = [];

export const setRoomsArray = (array: Room[]): Room[] => (roomsArray = array);

const checkNameRoom = (nameRoom: string): Room | undefined =>
  roomsArray.find((room: Room): boolean => room.roomName === nameRoom);

export default (io) => {
  io.on("connection", (socket) => {
    const username: string | undefined = socket.handshake.query.username;

    if (!username) {
      socket.emit(socketEvents.BAD_USER_NAME);
      socket.leave(socket.rooms);
    } else {
      if (usersArray.has(username)) {
        socket.emit(socketEvents.BAD_USER_NAME);
      } else {
        usersArray.add(username);

        if (roomsArray.length !== 0) {
          socket.emit(socketEvents.GET_ROOMS, roomsArray);
        }

        socket.on("disconnect", () => {
          usersArray.delete(username);
        });
      }
    }

    socket.on(socketEvents.NEW_ROOM, (room: Room): void => {
      if (checkNameRoom(room.roomName)) {
        socket.emit(socketEvents.BAD_ROOM_NAME);
      } else {
        setRoomsArray([...roomsArray, room]);
        socket.emit(socketEvents.ADD_ROOM, { room, myRoom: true });
        socket.broadcast.emit(socketEvents.ADD_ROOM, { room });
      }
    });
  });
};
