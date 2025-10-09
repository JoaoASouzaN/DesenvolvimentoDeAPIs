import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";

export class UserController {
    userBusiness = new UserBusiness();

    public getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    error: 'ID do usuário é obrigatório e deve ser um número'
                });
            }
            const idNumber = Number(id);
            const user = await this.userBusiness.getUserById(idNumber);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            res.status(200).send(user);
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    };

    public getAll = async (req: Request, res: Response) => {
        try {
            const users = await this.userBusiness.getAllUsers();
            res.status(200).send(users);
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    };

    public postUser = async (req: Request, res: Response) => {
        try {
            const { name, email } = req.body;
    
            if (!name || !email) {
                return res.status(400).json({ error: "Campos obrigatórios não preenchidos" });
            }
    
            const newUser = await this.userBusiness.postUser({ name, email });
    
            // Retornar sucesso incluindo o id
            return res.status(201).json({
                message: `Usuário ${newUser.name} criado com sucesso!`,
                user: newUser
            });
        } catch (error: any) {
            // Se o erro for de email duplicado retorna 409
            if (error.message === "Email já cadastrado") {
                return res.status(409).json({ error: error.message });
            }
    
            // Se for qualquer outro tipo retorna 500
            return res.status(500).json({ error: error.message });
        }
    };

    public putUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, email } = req.body;
    
            // Validando o ID
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ error: "ID do usuário deve ser um número." });
            }
    
            // Verificando se o nome e email foram fornecidos
            if (!name || !email) {
                return res.status(400).json({ error: "Os campos 'name' e 'email' são obrigatórios." });
            }
    
            const userId = Number(id);
    
            // Atualização via camada de negócios
            const updatedUser = await this.userBusiness.putUser(userId, { name, email });
    
            res.status(200).json({ 
                message: `Usuário ${updatedUser.name} atualizado com sucesso!`,
                user: updatedUser
            });
        } catch (error: any) {
            if (error.message === "Email já cadastrado") {
                return res.status(409).json({ error: error.message });
            }
    
            res.status(500).json({ error: error.message });
        }
    };

    public deleteUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
    
            // Validação de ID
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ error: "ID do usuário deve ser um número." });
            }
    
            const userId = Number(id);
    
            // Chamar camada de negócios
            const deletedUser = await this.userBusiness.deleteUser(userId);
    
            if (!deletedUser) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }
    
            // Retornar sucesso
            return res.status(200).json({
                message: `Usuário ${deletedUser.name} (${deletedUser.email}) deletado com sucesso!`
            });
    
        } catch (error: any) {
            if (error.message === "Usuário possui pets vinculados") {
                return res.status(409).json({ error: error.message });
            }
    
            res.status(500).json({ error: error.message });
        }
    };
};