import express from 'express'
import { UserController } from '../controller/UserController';

export const userRouter = express.Router();

const userController = new UserController();

// Metodos GET
userRouter.get('/', userController.getAll);
userRouter.get('/:id', userController.getById);

// Metodo POST
userRouter.post('/criarUser', userController.postUser);

// Metodos PUT/PATCH
userRouter.put('/alterar/:id', userController.putUser);

// Metodo DELETE
userRouter.delete('/deletar/:id', userController.deleteUser);