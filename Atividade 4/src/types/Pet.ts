export type Pet = {
    id: number;
    namePet: string;
    user_id: number;
};

export interface NewPet {
    namePet: string;
    user_id: number;
}