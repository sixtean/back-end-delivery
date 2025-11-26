import 'reflect-metadata';
import express from 'express';
import cors from 'cors'
import { Connection } from './data/Data-Source';
import { Category } from './models/Category';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import path from 'path';

import authRouter from './routes/auth.routes';
import companyRouter from './routes/company.routes';
import ClientRouter from './routes/client.routes';
import categoryRoutes from './routes/category.routes';
import customRouter from './routes/custom.routes';
import configRouter from './routes/config.routes';
import ZoryonRouter from './routes/Zoryon.routes';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

const allowedOrigins = [
    'https://rainbow-nasturtium-dffabf.netlify.app',
    'https://dulcet-fairy-f75529.netlify.app',
    'http://localhost:5173',
    'http://localhost:5174',
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: function(origin, callback){
            if(!origin) return callback(null, true);
            if(allowedOrigins.indexOf(origin) === -1){
                const msg = 'A política CORS impede esta origem';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true,
    })
);

app.use("/zoryon", ZoryonRouter);


app.use("/auth", authRouter);
app.use("/company", companyRouter);
app.use("/client", ClientRouter);
app.use("/categories", categoryRoutes);
app.use("/custom", customRouter);
app.use("/config", configRouter);

Connection.initialize()
    .then(async () => {
        const categoryRepo = Connection.getRepository(Category);
        const defaults =  [
            {name: "Principal", description: "Categoria dos principais produtos" },
            {name: "Destaque", description: "Categoria de produtos destaques" },
        ]

        for (const cat of defaults) {
            const exists = await categoryRepo.findOne({ where: { name: cat.name} });
            if(!exists) {
                await categoryRepo.save(categoryRepo.create(cat));
            }
        }

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em https://zoryonwipe.online`);
        });
    })
    .catch((error) => {
        console.clear();
        console.error('❌ Erro ao conectar ao banco de dados:', error);
    });