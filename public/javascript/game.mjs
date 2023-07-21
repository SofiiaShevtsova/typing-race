import { showInputModal } from "./views/modal.mjs";
import { allRooms, createRoom } from "./allRooms.mjs";
import { choiseRoom } from "./room.mjs";
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
		createRoom(roomName, username);
    },
  });
};

  const showRoom = (room) => {
	  appendRoomElement({ name: room.roomName, numberOfUsers: room.userList.length, onJoin: () => { } });
	  choiseRoom(username)
  };


allRooms(username, showRoom);

createRoomBtn.addEventListener("click", createNewRoom);
