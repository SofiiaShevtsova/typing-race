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
    socket.on(socketEvents.NEW_USER, ({ username }) => {
      if (usersArray.has(username)) {
        socket.emit(socketEvents.BAD_USER_NAME);
      } else {
        usersArray.add(username);

        if (roomsArray.length !== 0) {
          socket.emit(socketEvents.GET_ROOMS, roomsArray);
        }

        socket.on("disconnect", () => {
          usersArray.delete(username);

          const roomWithUser = roomsArray.find((room) =>
            room.userList.includes(username)
          );
          if (roomWithUser) {
            roomWithUser.userList = roomWithUser.userList.filter(
              (name) => name !== username
            );
            roomWithUser.userList.length === 0 &&
              setRoomsArray(
                roomsArray.filter(
                  (room) => room.roomName !== roomWithUser.roomName
                )
              );
          }
        });
      }
    });

    socket.on(socketEvents.NEW_ROOM, (room) => {
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
