type SocketEvents = {
    NEW_ROOM: string;
    NEW_USER: string;
    BAD_ROOM_NAME: string;
    BAD_USER_NAME: string;
    ADD_ROOM: string;
    GET_ROOMS: string;
    JOIN_ROOM: string;
    JOINED_ROOM: string;
}

export const socketEvents: SocketEvents = {
    NEW_ROOM: 'new-room',
    NEW_USER: 'new-user',
    BAD_ROOM_NAME: 'bad-room-name',
    BAD_USER_NAME: 'bad-user-name',
    ADD_ROOM: 'add-room',
    GET_ROOMS: 'get-rooms',
    JOIN_ROOM: 'join-room',
    JOINED_ROOM: 'joined-room',
}