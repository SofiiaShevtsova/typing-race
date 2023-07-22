import { showInputModal } from "./views/modal.mjs";
import { allRooms, createRoom } from "./allRooms.mjs";
import { onJoinRoom, joinMyRoom } from "./room.mjs";
import { appendRoomElement } from "./views/room.mjs";

const createRoomBtn = document.querySelector("#add-room-btn");

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
    joinMyRoom(room.roomName, username)
  }
};

allRooms(username, showRoom);

createRoomBtn.addEventListener("click", createNewRoom);
