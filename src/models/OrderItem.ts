import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  order!: Order;

  @ManyToOne(() => Product)
  product!: Product;

  @Column()
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;
}
