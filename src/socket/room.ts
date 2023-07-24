import { socketEvents } from "../commons/constants";
import { roomsArray, setRoomsArray, Room } from "./allRooms";
import { texts } from "../data";

export const startedGameRooms = new Set();

type Progress = {
  username: string;
  progress: number;
};

let winners: string[] = [];
let progressUsersList: Progress[] = [];

const checkRoomsList = (roomName: string): Room | undefined =>
  roomsArray.find((room: Room): boolean => room.roomName === roomName);

const getRoom = (username: string): Room | undefined =>
  roomsArray.find((room) => room.userList.includes(username));

const getText = () => Math.floor(Math.random() * texts.length);

export default (io) => {
  io.on("connection", (socket) => {
        const user: string | undefined = socket.handshake.query.username;

    const deleteUser = (prevRoom: Room, username: string): void => {
      prevRoom.userList = prevRoom.userList.filter(
        (name: string): boolean => name !== username
      );
      if (prevRoom.userList.length === 0) {
        setRoomsArray(roomsArray.filter((room) => room.userList.length !== 0));
        io.emit(socketEvents.DELETE_ROOM, prevRoom);
      }
    };

    const quitRoom = (userForLeave: string): void => {
      const room: Room | undefined = getRoom(userForLeave);
      if (!room) {
        return;
      }
      socket.emit(socketEvents.LEAVE_ROOM_DONE, {
        current: room,
        username: userForLeave,
      });
      socket.broadcast.emit(socketEvents.LEAVE_ROOM_DONE, {
        current: room,
        username: userForLeave,
      });
      deleteUser(room, userForLeave);
    };

    socket.on(socketEvents.JOIN_ROOM, ({ roomName, username }:{roomName: string, username: string}):void => {
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
        deleteUser(prevRoom, username);
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

    socket.on(socketEvents.CHANGE_STATUS, ({ isReady, username }:{isReady:boolean, username: string} ): void => {
      socket
        .to(getRoom(username)?.roomName)
        .emit(socketEvents.CHANGE_STATUS_DONE, { isReady, username });
      socket.emit(socketEvents.CHANGE_STATUS_DONE, { isReady, username });
    });

    socket.on(
      socketEvents.SEND_PROGRESS,
      ({ username:currentUser, progress }: Progress): void => {
        const userExsist = progressUsersList.findIndex(
          ({ username }) => currentUser === username
        );

        if (progress === 100) {
          winners = [...winners, currentUser];
          progressUsersList = progressUsersList.splice(userExsist, 1);
        }
        userExsist !== -1
          ? (progressUsersList[userExsist] = { username:currentUser, progress })
          : progressUsersList.push({ username:currentUser, progress });
        socket
          .to(getRoom(currentUser)?.roomName)
          .emit(socketEvents.GET_PROGRESS, { username:currentUser, progress });
      }
    );

    socket.on(socketEvents.SEND_GAME_RESULT, (username:string):void => {
      const list: Progress[] = progressUsersList.sort(
        ({ progress }, { progress: nextProgress }) => nextProgress - progress
      );
      if (startedGameRooms.has(getRoom(username)?.roomName)) {
        const addWinners:string[] = list.map(({ username: user }) => user);
        winners = [...winners, ...addWinners];
        startedGameRooms.delete(getRoom(username)?.roomName);
        socket.emit(socketEvents.SHOW_RESULT, winners);
        socket
          .to(getRoom(username)?.roomName)
          .emit(socketEvents.SHOW_RESULT, winners);
      }
      winners = [];
      progressUsersList = [];
    });

    socket.on(socketEvents.LEAVE_ROOM, (username: string): void => {
      socket.leave(socket.rooms);
      quitRoom(username);
    });

    socket.on(socketEvents.START_GAME, (roomName: string): void => {
      if (startedGameRooms.has(roomName)) {
        return;
      }
      startedGameRooms.add(roomName);
      const textId = getText();
      socket.emit(socketEvents.START_GAME_TEXT, { textId, roomName });
      socket
        .to(roomName)
        .emit(socketEvents.START_GAME_TEXT, { textId, roomName });
      socket.broadcast.emit(socketEvents.DELETE_ROOM, { roomName });
    });

    socket.on("disconnect", () => {
     user && quitRoom(user);
    });
  });
};
