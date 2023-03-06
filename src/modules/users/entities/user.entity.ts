import { Address } from "modules/geo/types/address.type";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Coords } from "../types/coords.type";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public hashedPassword: string;

  @Column({ type: "jsonb" })
  public address: Address;

  @Column({ type: "jsonb" })
  public coordinates: Coords;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
