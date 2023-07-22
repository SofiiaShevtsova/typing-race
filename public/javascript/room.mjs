// import { createElement, addClass, removeClass } from "./helper.mjs";
import { socketEvents, socketNamespace } from "./helpers/constants.mjs";
import {
  updateNumberOfUsersInRoom,
  removeRoomElement,
  hideRoomElement,
} from "./views/room.mjs";
import { MAXIMUM_USERS_FOR_ONE_ROOM } from "./helpers/constants.mjs";
import { appendUserElement } from "./views/user.mjs";

const socket = io(socketNamespace.ROOM);

const gameRoom = document.getElementById("game-page");
const roomsPage = document.getElementById("rooms-page");
const roomTitle = gameRoom.querySelector("#room-name");
const usersContainer = document.querySelector("#users-wrapper");

export const onJoinRoom = (username) => {
  return (event) => {
    const roomName = event.target.dataset.roomName;
    socket.emit(socketEvents.JOIN_ROOM, { roomName, username });
  };
};

export const joinMyRoom = (roomName, username) => {
  socket.emit(socketEvents.JOIN_ROOM, { roomName, username });
};

const deleteRoom = ({ roomName }) => {
  removeRoomElement(roomName);
};

const updateUserList = (userList) => {
  console.log(userList);
  //   counterValue.innerText = newValue;
};

// const updateRooms = rooms => {
//   const allRooms = rooms.map(createRoomButton);
//   roomsContainer.innerHTML = "";
//   roomsContainer.append(...allRooms);
// };

const joinRoomDone = ({ current, prev, username = null }) => {
  updateNumberOfUsersInRoom({
    name: current.roomName,
    numberOfUsers: current.userList.length,
  });
  prev &&
    updateNumberOfUsersInRoom({
      name: prev.roomName,
      numberOfUsers: prev.userList.length,
    });
  if (current.userList.length === MAXIMUM_USERS_FOR_ONE_ROOM) {
    hideRoomElement(current.roomName);
  }

  if (username) {
    gameRoom.classList.remove("display-none");
    roomsPage.classList.add("display-none");
    roomTitle.textContent = current.roomName;
    current.userList.map((name) =>
      appendUserElement({
        username: name,
        ready: false,
        isCurrentUser: name === username,
      })
    );
  }

  //   const newRoomElement = document.getElementById(roomName);
  //   addClass(newRoomElement, "active");

  //   if (activeRoomId) {
  //     const previousRoomElement = document.getElementById(activeRoomId);
  //     removeClass(previousRoomElement, "active");
  //   }

  //   removeClass(counterContainer, "disabled");
  //   updateUserList(current.userList);
  //   setActiveRoomName(current.roomName);
};

// socket.on("UPDATE_ROOMS", updateRooms);
socket.on(socketEvents.DELETE_ROOM, deleteRoom);
socket.on(socketEvents.JOINED_ROOM, joinRoomDone);
