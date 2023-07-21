import { showMessageModal } from "./views/modal.mjs";
import { socketEvents, socketNamespace } from "../javascript/helpers/constants.mjs";

  const socket = io(socketNamespace.ALL_ROOMS);

export const allRooms = (username, showRoom) => {
  socket.emit(socketEvents.NEW_USER, {username});

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
    
const showAdedRoom = room => showRoom(room)

  const showAllRooms = (data) => {
    data.map((room) =>showRoom(room));
  };

  socket.on(socketEvents.BAD_USER_NAME, badUserName);
  socket.on(socketEvents.BAD_ROOM_NAME, badRoomName);
  socket.on(socketEvents.ADD_ROOM, showAdedRoom);
  socket.on(socketEvents.GET_ROOMS, showAllRooms);
};

export const createRoom = (roomName, username) => {
  socket.emit(socketEvents.NEW_ROOM, {roomName, userList:[username]});
};
