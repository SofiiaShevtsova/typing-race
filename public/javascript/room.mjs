// import { createElement, addClass, removeClass } from "./helper.mjs";
import { socketEvents, socketNamespace } from "./helpers/constants.mjs";

const socket = io(socketNamespace.ROOM);

    let activeRoomName = null;

const setActiveRoomId = roomName => {
    activeRoomNAme = roomName;
}

const onJoinRoom = (username) => { 
    return (event) => {
    const roomName = event.target.dataset.roomName
    console.log(roomName);
    if (activeRoomName === roomName) {
      return;
    }
socket.emit(socketEvents.JOIN_ROOM, {roomName, username});
  };
}

export const choiseRoom = (username) => {
    const roomButtonList = document.querySelectorAll('.join-btn')
    roomButtonList.forEach(roomButton => {
        console.log(roomButton);
        roomButton.addEventListener("click", onJoinRoom(username))
    })
};


// const counterContainer = document.getElementById("counter-container");
// const counterValue = document.getElementById("counter-value");
// const roomsContainer = document.getElementById("rooms-container");


// const onClickCounter = () => {
//   if (!activeRoomId) {
//     return;
//   }
//   socket.emit("INCREASE_COUNTER");
// };

// counterContainer.addEventListener("click", onClickCounter);

  

//   roomButton.innerText = roomId;

//   return roomButton;
// };

// const updateCounterValue = newValue => {
//   counterValue.innerText = newValue;
// };

// const updateRooms = rooms => {
//   const allRooms = rooms.map(createRoomButton);
//   roomsContainer.innerHTML = "";
//   roomsContainer.append(...allRooms);
// };

// const joinRoomDone = ({ counterValue, roomId }) => {
//   const newRoomElement = document.getElementById(roomId);
//   addClass(newRoomElement, "active");

//   if (activeRoomId) {
//     const previousRoomElement = document.getElementById(activeRoomId);
//     removeClass(previousRoomElement, "active");
//   }

//   removeClass(counterContainer, "disabled");
//   updateCounterValue(counterValue);
//   setActiveRoomId(roomId);
// };

// socket.on("UPDATE_ROOMS", updateRooms);
// socket.on("UPDATE_COUNTER", updateCounterValue);
// socket.on("JOIN_ROOM_DONE", joinRoomDone);