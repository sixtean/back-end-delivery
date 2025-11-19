// src/entities/CompanyConfig.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  import { Company } from "./Company";
  
  @Entity()
  export class SistemConfig {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column("simple-json", { nullable: false })
    settings!: any;
  
    @OneToOne(() => Company, (company) => company.config, {
      onDelete: "CASCADE"
    })
    @JoinColumn()
    company!: Company;
  }
  