import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Company } from "./Company";
import { Order } from "./Order";
import { Address } from "./Address";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Company, (company) => company.users, { onDelete: 'CASCADE' })
    company!: Company;

    @Column({ length: 100 })
    name!: string;

    @Column()
    password!: string;

    @Column({ type: 'enum', enum: ['client', 'employee', 'admin'], default: 'client' })
    role!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @OneToMany(() => Order, (order) => order.user)
    orders!: Order[];

    @OneToMany(() => Address, (address) => address.user)
    addresses!: Address[];
}