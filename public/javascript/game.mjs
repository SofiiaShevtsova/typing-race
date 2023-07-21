import { showMessageModal, showInputModal } from "./views/modal.mjs";
import { appendRoomElement } from "./views/room.mjs";

let roomName;

const createRoomBtn = document.querySelector("#add-room-btn");

const username = sessionStorage.getItem("username");

if (!username) {
  window.location.replace("/login");
}

const socket = io("http://localhost:3002/all-rooms", { query: { username } });

const showError = () => {
  const onClose = () => {
    sessionStorage.removeItem("username");
    window.location.replace("/login");
  };
  showMessageModal({ message: "Enter new name!", onClose });
};

const getRoomName = (e) => {};

socket.on("BAD_USER_NAME", showError);

createRoomBtn.addEventListener("click", (e) => {
  showInputModal({
    title: "Room name",
    onChange: (name) => {
      roomName = name;
    },
    onSubmit: () => {
      appendRoomElement({ name: roomName, numberOfUsers: 1, onJoin: () => {} });
      const socketRoom = io("http://localhost:3002/room", {
        query: { roomName },
      });
    },
  });
});
