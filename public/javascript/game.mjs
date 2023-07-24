import { showInputModal } from "./views/modal.mjs";
import { allRooms, createRoom } from "./allRooms.mjs";
import { onJoinRoom, joinMyRoom, sendStatus } from "./room.mjs";
import { appendRoomElement } from "./views/room.mjs";
import { removeClass, addClass } from "./helpers/domHelper.mjs";
import { randomText } from "./randomText.mjs";
import { Game } from "./startGame.mjs";

const createRoomBtn = document.querySelector("#add-room-btn");
const gameRoom = document.getElementById("game-page");
const roomsPage = document.getElementById("rooms-page");
const roomTitle = gameRoom.querySelector("#room-name");
const readyStatusBtn = document.getElementById("ready-btn");
const quitRoomBtn = document.getElementById("quit-room-btn");

const username = sessionStorage.getItem("username");
if (!username) {
  window.location.replace("/login");
}

const createNewRoom = () => {
  let roomName;
  showInputModal({
    title: "Room name",
    onChange: (name) => {
      roomName = name;
    },
    onSubmit: () => {
      createRoom(roomName);
    },
  });
};

const showRoom = (room, myRoom = false) => {
  appendRoomElement({
    name: room.roomName,
    numberOfUsers: room.userList.length,
    onJoin: onJoinRoom(username),
  });
  if (myRoom) {
    joinMyRoom(room.roomName, username);
  }
};

export const userInRoom = (roomName) => {
  removeClass(gameRoom, "display-none");
  addClass(roomsPage, "display-none");
  roomTitle.textContent = roomName;
};

export const userOutOfRoom = () => {
  removeClass(roomsPage, "display-none");
  addClass(gameRoom, "display-none");
  roomTitle.textContent = "";
};

const changeUserStatus = (event) => {
  const isReady = event.currentTarget.textContent === "READY" ? true : false;
  readyStatusBtn.textContent = isReady ? "NOT READY" : "READY";
  sendStatus({ isReady, user: username });
};

export const startGame = async ({ textId, currentUser }) => {
  const text = await randomText(textId);
  const game = new Game({ text, user: currentUser });
  game.start();
};

export const gameEnd = () => {
  readyStatusBtn.textContent = "READY";
  removeClass(readyStatusBtn, "display-none");
  removeClass(quitRoomBtn, "display-none");
};

allRooms(username, showRoom);

createRoomBtn.addEventListener("click", createNewRoom);
readyStatusBtn.addEventListener("click", changeUserStatus);
