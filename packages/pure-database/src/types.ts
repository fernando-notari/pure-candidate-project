export interface User {
    id: string;
    username: string;
    profilePicture: string;
}

export interface Group {
    id: string;
    name: string;
    memberCount: number;
    backgroundColor: string;
    icon: string;
}

export interface Game {
    id: string;
    gamemode: string;
    bigBlind: number;
    seats: number;
    seatsAvailable: number;
    groupId: string;
    players: number[];
}

export interface Friendship {
    id: string;
    userIdLow: string;
    userIdHigh: string;
}
