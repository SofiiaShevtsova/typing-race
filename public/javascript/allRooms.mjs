import { showMessageModal } from "./views/modal.mjs";
import { appendRoomElement } from "./views/room.mjs";
import { socketEvents, socketNamespace } from "../javascript/helpers/constants.mjs";

export const allRooms = (username) => {
  const socket = io(socketNamespace.ALL_ROOMS, { query: { username } });

  const badUserName = () => {
    const onClose = () => {
      sessionStorage.removeItem("username");
      window.location.replace("/login");
    };
    showMessageModal({ message: "Enter new name!", onClose });
  };
// Чогось не працює, треба розібратися)))
  const badRoomName = () => {
    showMessageModal({ message: "Enter new name!" });
  };

  const showRoom = (room) => {
    appendRoomElement({ name: room, numberOfUsers: 1, onJoin: () => {} });
  };

  const showAllRooms = (data) => {
    data.map((room) => {
      appendRoomElement({ name: room, numberOfUsers: 1, onJoin: () => {} });
    });
  };

  socket.on(socketEvents.BAD_USER_NAME, badUserName);
  socket.on(socketEvents.BAD_ROOM_NAME, badRoomName);
  socket.on(socketEvents.ADD_ROOM, showRoom);
  socket.on(socketEvents.GET_ROOMS, showAllRooms);
};

export const createRoom = (roomName) => {
  const socket = io(socketNamespace.ALL_ROOMS);
  socket.emit(socketEvents.NEW_ROOM, { nameRoom: roomName });
};
