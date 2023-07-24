// import { createElement, addClass, removeClass } from "./helper.mjs";
import { socketEvents, socketNamespace } from "./helpers/constants.mjs";
import {
  updateNumberOfUsersInRoom,
  removeRoomElement,
  hideRoomElement,
} from "./views/room.mjs";
import { MAXIMUM_USERS_FOR_ONE_ROOM } from "./helpers/constants.mjs";
import {
  appendUserElement,
  changeReadyStatus,
  removeUserElement,
  setProgress,
} from "./views/user.mjs";
import { userInRoom, startGame, userOutOfRoom, gameEnd } from "./game.mjs";
import { showResultsModal } from "./views/modal.mjs";

const quitRoomBtn = document.getElementById("quit-room-btn");

let socket;

let currentUser;
let currentRoom;

const gameRoom = document.getElementById("game-page");
const roomTitle = gameRoom.querySelector("#room-name");
const usersContainer = document.querySelector("#users-wrapper");

const deleteRoom = ({ roomName }) => {
  removeRoomElement(roomName);
};

const onClickQuitRoomBtn = () => {
  socket.emit(socketEvents.LEAVE_ROOM, currentUser);
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
    userInRoom(current.roomName);
    currentUser = username;
    currentRoom = current.roomName;
    quitRoomBtn.addEventListener("click", onClickQuitRoomBtn);
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

export const sendStatus = ({ isReady, user }) => {
  socket.emit(socketEvents.CHANGE_STATUS, { isReady, username: user });
};

const changedStatus = async ({ isReady, username }) => {
  changeReadyStatus({ username, ready: isReady });

  const statusList = [...document.querySelectorAll(".ready-status")];
  const start = statusList.every((status) => status.dataset.ready === "true");
  if (start) {
    socket.emit(socketEvents.START_GAME, currentRoom);
  }
};

export const sendUserProgress = ({ username, progress }) => {
  socket.emit(socketEvents.SEND_PROGRESS, { username, progress });
};

const getprogress = ({ username, progress }) => {
  setProgress({ username, progress });
};

export const gameResult = (username) => {
  socket.emit(socketEvents.SEND_GAME_RESULT, username);
};

const showResult = (winners) => {
  const onClose = () => {
    gameEnd();
    winners.map((username) => {
      changeReadyStatus({ username, ready: false });
      setProgress({ username, progress: 0 });
    });
  };
  showResultsModal({ usersSortedArray: winners, onClose });
};

const leaveRoom = ({ username, current }) => {
  if (username === currentUser) {
    userOutOfRoom();
  }
  removeUserElement(username);
  updateNumberOfUsersInRoom({
    name: current.roomName,
    numberOfUsers: current.userList.length - 1,
  });
};

const gameStarted = async ({ textId }) => {
  await startGame({ textId, currentUser });
};

const socketEventsList = (socket) => {
  socket.on(socketEvents.DELETE_ROOM, deleteRoom);
  socket.on(socketEvents.JOINED_ROOM, joinRoomDone);
  socket.on(socketEvents.CHANGE_STATUS_DONE, changedStatus);
  socket.on(socketEvents.LEAVE_ROOM_DONE, leaveRoom);
  socket.on(socketEvents.START_GAME_TEXT, gameStarted);
  socket.on(socketEvents.GET_PROGRESS, getprogress);
  socket.on(socketEvents.SHOW_RESULT, showResult);
};

export const onJoinRoom = (username) => {
  socket = io(socketNamespace.ROOM, { query: { username } });
  socketEventsList(socket);
  return (event) => {
    const roomName = event.target.dataset.roomName;
    socket.emit(socketEvents.JOIN_ROOM, { roomName, username });
  };
};

export const joinMyRoom = (roomName, username) => {
  socket = io(socketNamespace.ROOM, { query: { username } });
  socketEventsList(socket);
  socket.emit(socketEvents.JOIN_ROOM, { roomName, username });
};
