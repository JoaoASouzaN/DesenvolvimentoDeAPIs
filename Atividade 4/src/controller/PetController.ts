import { Request, Response } from "express";
import { PetBusiness } from "../business/PetBusiness";

export class PetController {
    petBusiness = new PetBusiness();

    public getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ error: "ID do pet é obrigatório e deve ser um número." });
            }

            const petId = Number(id);
            const pet = await this.petBusiness.getPetById(petId);

            if (!pet) {
                return res.status(404).json({ error: "Pet não encontrado." });
            }

            res.status(200).json(pet);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    public getAllPets = async (req: Request, res: Response) => {
        try {
            const pets = await this.petBusiness.getAllPets();
            res.status(200).json(pets);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    public postPet = async (req: Request, res: Response) => {
        try {
            const { namePet, user_id } = req.body;

            if (!namePet || !user_id) {
                return res.status(400).json({ error: "Campos obrigatórios não preenchidos (namePet e user_id)." });
            }

            const newPet = await this.petBusiness.postPet({ namePet, user_id });
            res.status(201).json({
                message: `Pet ${newPet.namePet} criado com sucesso!`,
                pet: newPet
            });
        } catch (error: any) {
            if (error.message.includes("Usuário não encontrado")) {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    };

    public putPet = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { namePet, user_id } = req.body;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ error: "ID do pet deve ser um número." });
            }

            if (!namePet || !user_id) {
                return res.status(400).json({ error: "Campos obrigatórios não preenchidos (namePet e user_id)." });
            }

            const petId = Number(id);
            const updatedPet = await this.petBusiness.putPet(petId, { namePet, user_id });

            res.status(200).json({
                message: `Pet ${updatedPet.namePet} atualizado com sucesso!`,
                pet: updatedPet
            });
        } catch (error: any) {
            if (error.message.includes("Pet não encontrado") || error.message.includes("Usuário não encontrado")) {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    };

    public deletePet = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ error: "ID do pet deve ser um número." });
            }

            const petId = Number(id);
            const result = await this.petBusiness.deletePet(petId);

            res.status(200).json(result);
        } catch (error: any) {
            if (error.message.includes("Pet não encontrado")) {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    };
}
