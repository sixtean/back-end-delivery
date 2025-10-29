import 'reflect-metadata';
import express from 'express';
import cors from 'cors'
import { Connection } from './data/Data-Source';
import authRouter from './routes/auth.routes';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

Connection.initialize()
    .then(() => {
        console.log('✅ Banco de dados conectado com sucesso!');

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.clear();
        console.error('❌ Erro ao conectar ao banco de dados:', error);
    });
