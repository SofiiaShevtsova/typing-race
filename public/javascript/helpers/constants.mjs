export const socketEvents = {
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
  LEAVE_ROOM: 'leave-room',
  LEAVE_ROOM_DONE: 'leave-room-done',
  START_GAME: 'start-game',
  START_GAME_TEXT: 'start-game-text',
  SEND_PROGRESS: 'send-progress',
  GET_PROGRESS: 'get-progress',
  SEND_GAME_RESULT: 'send-game-result',
  SHOW_RESULT: 'show-result',
};

export const MAXIMUM_USERS_FOR_ONE_ROOM = 5;
export const SECONDS_TIMER_BEFORE_START_GAME = 10;
export const SECONDS_FOR_GAME = 60;
export const TEXT_URL = "http://localhost:3002/game/text/";
export const PROGRESS = 100;

export const socketNamespace = {
  ALL_ROOMS: "http://localhost:3002/all-rooms",
  ROOM: "http://localhost:3002/room",
};
