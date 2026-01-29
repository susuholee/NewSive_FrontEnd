export type LoginRequest = {
    username : string;
    password : string;
}

export type LoginResponse = {
    user : {
        id : number;
        username : string;
        nickname : string;
        birthday?: string;
        gender?: 'male' | 'female' | 'other';
        profileImgUrl?: string;
    }
}
