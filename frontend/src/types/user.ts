export interface User {
    _id: string;
    username: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    avatarId?: string;
    bio?: string;
    phone?: string;
}