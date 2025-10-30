import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Company } from "./Company";
import { User } from "./User";
import { OrderItem } from "./OrderItem";
import { Payment } from "./Payment";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, company => company.orders, { onDelete: 'CASCADE' })
  company: Company;

  @ManyToOne(() => User, user => user.orders, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: ['pending','preparing','delivering','completed','canceled'], default: 'pending' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => OrderItem, item => item.order)
  items: OrderItem[];

  @OneToMany(() => Payment, payment => payment.order)
  payments: Payment[];
}
