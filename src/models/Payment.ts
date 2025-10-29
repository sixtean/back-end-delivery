import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./Order";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.payments, { onDelete: 'CASCADE' })
  order: Order;

  @Column({ type: 'enum', enum: ['cash','card','pix'], default: 'cash' })
  method: string;

  @Column({ type: 'enum', enum: ['pending','paid','failed'], default: 'pending' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
