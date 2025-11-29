import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import express from 'express';
import cors from 'cors'
import { Connection } from './data/Data-Source';
import { Category } from './models/Category';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.routes';
import companyRouter from './routes/company.routes';
import ClientRouter from './routes/client.routes';
import categoryRoutes from './routes/category.routes';
import customRouter from './routes/custom.routes';
import configRouter from './routes/config.routes';
import paymentRouter from './routes/payment.route';

import ZoryonRouter from './routes/Zoryon.routes';

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

const allowedOrigins: string[] = [
    'https://rainbow-nasturtium-dffabf.netlify.app',
    'https://zoryonwipe.com',
    'https://zoryonwipe.online',
    'http://localhost:5173',
    'http://localhost:5174',
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }

    
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

app.use("/zoryon", ZoryonRouter);


app.use("/auth", authRouter);
app.use("/company", companyRouter);
app.use("/client", ClientRouter);
app.use("/categories", categoryRoutes);
app.use("/custom", customRouter);
app.use("/config", configRouter);
app.use("/payment", paymentRouter);

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