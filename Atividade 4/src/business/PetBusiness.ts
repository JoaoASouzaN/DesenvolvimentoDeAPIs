import { PetData } from "../data/PetData";
import { UserData } from "../data/UserData";
import { NewPet, Pet } from "../types/Pet";

export class PetBusiness {
    petData = new PetData();
    userData = new UserData(); // para validar se o user existe

    public async getPetById(petId: number): Promise<Pet | null> {
        try {
            const pet = await this.petData.getPetById(petId);
            return pet || null;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async getAllPets(): Promise<Pet[]> {
        try {
            const pets = await this.petData.getAllPets();
            return pets;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async postPet(input: { namePet: string; user_id: number }): Promise<NewPet> {
        try {
            const { namePet, user_id } = input;

            if (!namePet || typeof namePet !== "string" || namePet.trim() === "") {
                throw { status: 400, message: "Nome do pet inválido" };
            }

            if (!user_id || isNaN(user_id)) {
                throw { status: 400, message: "ID do usuário inválido" };
            }

            // Verifica se o usuário existe
            const userExists = await this.userData.getUserById(user_id);
            if (!userExists) {
                throw { status: 404, message: "Usuário não encontrado para associar o pet" };
            }

            const newPet: NewPet = { namePet, user_id };
            await this.petData.postPet(newPet);

            return newPet;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async putPet(id: number, input: { namePet: string; user_id: number }): Promise<Pet> {
        try {
            if (isNaN(id)) {
                throw { status: 400, message: "ID inválido, deve ser numérico" };
            }

            const { namePet, user_id } = input;

            if (!namePet || typeof namePet !== "string" || namePet.trim() === "") {
                throw { status: 400, message: "Nome do pet inválido" };
            }

            if (!user_id || isNaN(user_id)) {
                throw { status: 400, message: "ID do usuário inválido" };
            }

            // Verifica se o pet existe
            const pet = await this.petData.getPetById(id);
            if (!pet) {
                throw { status: 404, message: "Pet não encontrado" };
            }

            // Verifica se o usuário existe
            const userExists = await this.userData.getUserById(user_id);
            if (!userExists) {
                throw { status: 404, message: "Usuário não encontrado" };
            }

            const updatedPet: Pet = { id, namePet, user_id };
            await this.petData.putPet(id, updatedPet);

            return updatedPet;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async deletePet(id: number): Promise<{ message: string }> {
        try {
            if (isNaN(id)) {
                throw { status: 400, message: "ID inválido, deve ser um numero" };
            }

            const pet = await this.petData.getPetById(id);
            if (!pet) {
                throw { status: 404, message: "Pet não encontrado" };
            }

            await this.petData.deletePet(id);

            return { message: `Pet ${pet.namePet} deletado com sucesso!` };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
