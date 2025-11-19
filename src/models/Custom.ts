import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Company } from "./Company";

@Entity()
export class Customization {

  @PrimaryColumn()
  companyId!: number;

  @Column({ default: "#ff0000" })
  primaryColor!: string;

  @Column({ default: "#00ff00" })
  secondaryColor!: string;

  @Column({ default: "#0000ff" })
  tertiaryColor!: string;

  @Column({ nullable: true })
  logo!: string;

  @Column("simple-array", { nullable: true })
  ads!: string[];

  @OneToOne(() => Company, { onDelete: "CASCADE" })
  @JoinColumn({ name: "companyId" })
  company!: Company;
}