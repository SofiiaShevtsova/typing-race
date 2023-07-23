type SocketEvents = {
  NEW_ROOM: string;
  NEW_USER: string;
  BAD_ROOM_NAME: string;
  BAD_USER_NAME: string;
  ADD_ROOM: string;
  GET_ROOMS: string;
  JOIN_ROOM: string;
  JOINED_ROOM: string;
  DELETE_ROOM: string;
  CHANGE_STATUS: string;
  CHANGE_STATUS_DONE: string;
  LEAVE_ROOM: string;
  LEAVE_ROOM_DONE: string;
  START_GAME: string;
  START_GAME_TEXT: string;
};

export const socketEvents: SocketEvents = {
  NEW_ROOM: "new-room",
  NEW_USER: "new-user",
  BAD_ROOM_NAME: "bad-room-name",
  BAD_USER_NAME: "bad-user-name",
  ADD_ROOM: "add-room",
  GET_ROOMS: "get-rooms",
  JOIN_ROOM: "join-room",
  JOINED_ROOM: "joined-room",
  DELETE_ROOM: "delete-room",
  CHANGE_STATUS: "change-status",
  CHANGE_STATUS_DONE: "change-status-done",
  LEAVE_ROOM: "leave-room",
  LEAVE_ROOM_DONE: "leave-room-done",
  START_GAME: 'start-game',
  START_GAME_TEXT: 'start-game-text',
};
