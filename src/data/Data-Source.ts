import "reflect-metadata";
import { DataSource } from "typeorm";
import { Company } from "../models/Company";
import { User } from "../models/User";
import { Product } from "../models/Product";
import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { Address } from "../models/Address";
import { Payment } from "../models/Payment";
import { Category } from "../models/Category";
import { Customization } from "../models/Custom";
import { SistemConfig } from "../models/SistemConfigs";

import * as dotenv from 'dotenv';
dotenv.config();

export const Connection = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Company, User, Product, Order, OrderItem, Address, Payment, Category, Customization, SistemConfig],
    migrations: [],
    subscribers: [],
});