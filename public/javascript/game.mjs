import { showInputModal } from "./views/modal.mjs";
import { allRooms, createRoom } from "./allRooms.mjs";

const username = sessionStorage.getItem("username");
const createRoomBtn = document.querySelector("#add-room-btn");

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

allRooms(username);

createRoomBtn.addEventListener("click", createNewRoom);
