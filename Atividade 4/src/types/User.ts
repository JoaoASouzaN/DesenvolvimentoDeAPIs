export type User = {
    id: number;
    name: string;
    email: string;
};

export interface NewUser {
    name: string;
    email: string;
}