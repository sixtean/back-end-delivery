import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,OneToMany, UpdateDateColumn } from "typeorm";
import { User} from "./User";
import { Product } from "./Product";
import { Order } from "./Order";
import { SistemConfig } from "./SistemConfigs";

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name!: string;

    @Column({ length: 100 })
    password!: string;

    @Column({ type: "int", default: 5 })
    billing_day!: number;
    
    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @OneToMany(() => User, (user) => user.company)
    users!: User[];

    @OneToMany(() => Product, (product) => product.company)
    products!: Product[];

    @OneToMany(() => Order, (order) => order.company)
    orders!: Order[];

    @OneToMany(() => SistemConfig, (config) => config.company)
    config!: SistemConfig;

}