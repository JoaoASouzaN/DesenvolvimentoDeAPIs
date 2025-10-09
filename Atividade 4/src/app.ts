import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connection } from './dbConnection'

dotenv.config();

export const app = express()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Teste de conexão com o banco
const testConnection = async () => {
    try {
        await connection.raw('select 1');
        console.log('Banco conectado com sucesso');
    } catch (err: any) {
        console.error('Falha ao conectar no banco:', err?.message || err);
    }
};

testConnection();