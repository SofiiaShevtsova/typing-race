// import { createElement, addClass, removeClass } from "./helper.mjs";
import { socketEvents, socketNamespace } from "./helpers/constants.mjs";
import {
  updateNumberOfUsersInRoom,
  removeRoomElement,
  hideRoomElement,
} from "./views/room.mjs";
import { MAXIMUM_USERS_FOR_ONE_ROOM } from "./helpers/constants.mjs";
import { appendUserElement, changeReadyStatus } from "./views/user.mjs";
import { addClass, removeClass } from "./helpers/domHelper.mjs";
import { randomText } from "./randomText.mjs";
import { Game } from "./startGame.mjs";

const socket = io(socketNamespace.ROOM);

let currentUser;

const gameRoom = document.getElementById("game-page");
const roomsPage = document.getElementById("rooms-page");
const roomTitle = gameRoom.querySelector("#room-name");
const usersContainer = document.querySelector("#users-wrapper");
const readyStatusBtn = document.getElementById("ready-btn");

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
    removeClass(gameRoom, "display-none")
    addClass(roomsPage, "display-none")
    roomTitle.textContent = current.roomName;
    currentUser = username;
  }

  if (roomTitle.textContent === current.roomName) {
    usersContainer.innerHTML = "";
    current.userList.map((name) =>
      appendUserElement({
        username: name,
        ready: false,
        isCurrentUser: name === currentUser,
      })
    );
  }
};

const changeStatus = async({ isReady, user }) => {
  changeReadyStatus({ username: user, ready: isReady })
  const statusList = [...document.querySelectorAll('.ready-status')];

  const list = statusList.map(status => status.dataset.username)
  const startGame = statusList.every(status => status.dataset.ready === 'true')
  if (startGame) {
    const text = await randomText()
    const game = new Game({ text, list: list })
    game.start()
  }
}

socket.on(socketEvents.DELETE_ROOM, deleteRoom);
socket.on(socketEvents.JOINED_ROOM, joinRoomDone);
socket.on(socketEvents.CHANGE_STATUS_DONE, changeStatus)

const changeUserStatus = (event) => {
  const isReady = event.currentTarget.textContent === "READY" ? true : false;
  readyStatusBtn.textContent = isReady ? "NOT READY" : "READY";
  socket.emit(socketEvents.CHANGE_STATUS, {isReady, user: currentUser})
};

readyStatusBtn.addEventListener("click", changeUserStatus);
