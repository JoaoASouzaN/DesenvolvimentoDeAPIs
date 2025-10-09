import express from 'express'
import { PetController } from '../controller/PetController';

export const petRouter = express.Router();

const petController = new PetController();

// Metodos GET
petRouter.get('/', petController.getAllPets);
petRouter.get('/:id', petController.getById);

// Metodo POST
petRouter.post('/adicionarPet', petController.postPet);

// Metodos PUT
petRouter.put('/alterar/:id', petController.putPet);

// Metodo DELETE
petRouter.delete('/deletar/:id', petController.deletePet);