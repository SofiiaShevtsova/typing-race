import { socketEvents } from "../commons/constants";
import { startedGameRooms } from "./room";
import { MAXIMUM_USERS_FOR_ONE_ROOM } from "./config";

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
      return;
    } else {
      if (usersArray.has(username)) {
        socket.emit(socketEvents.BAD_USER_NAME);
      } else {
        usersArray.add(username);

        if (roomsArray.length !== 0) {
          const showRoomsArray = roomsArray.filter(
            (room: Room): boolean =>
              !startedGameRooms.has(room.roomName) ||
              room.userList.length === MAXIMUM_USERS_FOR_ONE_ROOM
          );
          socket.emit(socketEvents.GET_ROOMS, showRoomsArray);
        }

        socket.on("disconnect", () => {
          usersArray.delete(username);
          socket.leave(socket.rooms);
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
