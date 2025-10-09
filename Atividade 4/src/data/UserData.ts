import { connection } from "../dbConnection";
import { User, NewUser } from "../types/User";

export class UserData {
    async getUserById(userId: Number) {
        try {
            const user = await connection('users').where({ id: userId }).first();
            return user;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        try{
            const result = await connection('users').where({ email }).first();
        return result;
        } catch (error: any){
            throw new Error(error.sqlMessage || error.Message);
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

    async getAllUsers() {
        try {
            const users = await connection('users').select();
            return users;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async postUser(user: NewUser) {
        try {
            await connection('users').insert(user);
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async checkEmailExists(email: string): Promise<boolean> {
        try {
            const existing = await connection('users').where({ email }).first();
            return !!existing;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async putUser(id: number , updatedData: Partial<User>) {
        try{
            await connection('users')
            .where({ id })
            .update(updatedData);
        } catch (error: any){
            throw new Error(error.sqlMessage || error.message);
        }
    }

    async deleteUser(id: number) {
        try{
            await connection('users')
            .where({ id })
            .delete();
        } catch(error: any){
            throw new Error(error.sqlMessage || error.message);
        }
    }
}