import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Company } from "./Company";
import { Category } from "./Category";
import { IsArray, ArrayMaxSize, IsOptional } from "class-validator";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Company, (company) => company.products, { onDelete: "CASCADE" })
  company!: Company;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: "SET NULL",
    nullable: true,
  })
  category: Category | null = null;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  price!: number;

  @Column({ type: "int", default: 0 })
  stock!: number;

  @IsArray()
  @IsOptional()
  @ArrayMaxSize(5, { message: "Um produto pode ter no máximo 5 imagens." })
  @Column({ type: "simple-array", nullable: true })
  image_data?: string[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
