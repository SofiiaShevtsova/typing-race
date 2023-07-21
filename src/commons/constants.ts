type SocketEvents = {
    NEW_ROOM: string;
    BAD_ROOM_NAME: string;
    BAD_USER_NAME: string;
    ADD_ROOM: string;
    GET_ROOMS: string;
}

export const socketEvents: SocketEvents = {
    NEW_ROOM: 'new-room',
    BAD_ROOM_NAME: 'bad-room-name',
    BAD_USER_NAME: 'bad-user-name',
    ADD_ROOM: 'add-room',
    GET_ROOMS: 'get-rooms',
}