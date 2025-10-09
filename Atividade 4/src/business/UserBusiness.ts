import { UserData } from "../data/UserData";
import { NewUser, User } from "../types/User";

export class UserBusiness {

    userData = new UserData();

    public async getUserById(userId: Number): Promise<User | null> {
        try {
            const user = await this.userData.getUserById(userId);
            return user;
        } catch (error: any) {
            throw error;
        }
    };

    public async getAllUsers(): Promise<User[]> {
        try {
            const users = await this.userData.getAllUsers();
            return users;
        } catch (error: any) {
            throw new Error(error.message);
        }
    };

    public async postUser(input: { name: string; email: string }): Promise<NewUser> {
        try {
            const { name, email } = input;

        if (!name || typeof name !== "string" || name.trim() === "") {
            throw { status: 400, message: "Nome inválido" };
        }

        if (!email || typeof email !== "string" || !email.includes("@")) {
            throw { status: 400, message: "Email inválido" };
        }

        const emailExists = await this.userData.checkEmailExists(email);
        if (emailExists) {
            throw { status: 409, message: "Email já cadastrado" };
        }

        const novoUser: NewUser = {
            name,
            email
        };

        await this.userData.postUser(novoUser);
        return novoUser;
        } catch(error: any) {
            throw new Error(error.message);
        }
    };

    public async putUser(id: number, input: { name: string; email: string }): Promise<User> {
        try {
            if (isNaN(id)) {
                throw { status: 400, message: "ID inválido, deve ser um numero" };
            }
    
            const { name, email } = input;
    
            if (!name || typeof name !== "string" || name.trim() === "") {
                throw { status: 400, message: "Nome inválido" };
            }
    
            if (!email || typeof email !== "string" || !email.includes("@")) {
                throw { status: 400, message: "Email inválido" };
            }
    
            const user = await this.userData.getUserById(id);
            if (!user) {
                throw { status: 404, message: "Usuário não encontrado" };
            }
    
            const updatedUser: User = { id, name, email };
            await this.userData.putUser(id, updatedUser);
    
            return updatedUser;
        } catch (error: any) {
            throw new Error(error.message);
        }
    };
    
    public async deleteUser(id: number): Promise<{ name: string; email: string }> {
        try {
            if (isNaN(id)) {
                throw { status: 400, message: "ID inválido, deve ser numérico" };
            }
    
            const user = await this.userData.getUserById(id);
            if (!user) {
                throw { status: 404, message: "Usuário não encontrado" };
            }
    
            // Verificar se o usuário tem pets antes de excluir
            const pets = await this.userData.getPetsByUserId(id);
            if (pets.length > 0) {
                throw { status: 409, message: "Usuário possui pets vinculados. Não pode ser excluído." };
            }
    
            await this.userData.deleteUser(id);
    
            return {
                name: user.name,
                email: user.email
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    };
};