import { showMessageModal } from "./views/modal.mjs";
import {
  socketEvents,
  socketNamespace,
} from "../javascript/helpers/constants.mjs";
import { removeRoomElement } from "./views/room.mjs";

const socket = io(socketNamespace.ALL_ROOMS);

export const allRooms = (username, showRoom) => {
  socket.emit(socketEvents.NEW_USER, { username });

  const badUserName = () => {
    const onClose = () => {
      sessionStorage.removeItem("username");
      window.location.replace("/login");
    };
    showMessageModal({ message: "Enter new name!", onClose });
  };

  const badRoomName = () => {
    showMessageModal({ message: "Enter new name!" });
  };

  const showAdedRoom = ({room, myRoom=false}) =>
    myRoom ? showRoom(room, myRoom) : showRoom(room);

  const showAllRooms = (data) => {
    data.map((room) => showRoom(room));
  };

  const deleteRoom = ({ roomName }) => {
    console.log(roomName);
    removeRoomElement(roomName)
  }

  socket.on(socketEvents.BAD_USER_NAME, badUserName);
  socket.on(socketEvents.BAD_ROOM_NAME, badRoomName);
  socket.on(socketEvents.ADD_ROOM, showAdedRoom);
  socket.on(socketEvents.DELETE_ROOM, deleteRoom)
  socket.on(socketEvents.GET_ROOMS, showAllRooms);
};

export const createRoom = (roomName) => {
  socket.emit(socketEvents.NEW_ROOM, { roomName, userList: [] });
};
