import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,OneToMany, UpdateDateColumn } from "typeorm";
import { User} from "./User";
import { Product } from "./Product";
import { Order } from "./Order";

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name!: string;

    @Column({ length: 100, unique: true })
    password!: string;
    
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
}