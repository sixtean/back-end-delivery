import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.addresses, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ length: 150 })
  street!: string;

  @Column({ length: 20 })
  number!: string;

  @Column({ length: 100 })
  district!: string;

  @Column({ length: 100 })
  city!: string;

  @Column({ length: 50 })
  state!: string;

  @Column({ length: 20 })
  zip_code!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
