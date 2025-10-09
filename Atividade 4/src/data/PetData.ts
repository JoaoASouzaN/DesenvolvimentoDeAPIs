import { connection } from "../dbConnection";
import { Pet, NewPet } from "../types/Pet";

export class PetData {
    async getPetById(petId: number) {
        try {
            const pet = await connection('pets').where({ id: petId }).first();
            return pet;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async getPetsByUserId(userId: number) {
        try {
            const pets = await connection('pets').where({ user_id: userId });
            return pets;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async getAllPets() {
        try {
            const pets = await connection('pets').select();
            return pets;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async postPet(pet: NewPet) {
        try {
            await connection('pets').insert(pet);
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async putPet(id: number, updatedData: Partial<Pet>) {
        try {
            await connection('pets')
                .where({ id })
                .update(updatedData);
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async deletePet(id: number) {
        try {
            await connection('pets')
                .where({ id })
                .delete();
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
}