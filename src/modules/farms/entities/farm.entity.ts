import { Address } from "modules/geo/types/address.type";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Coords } from "../types/coords.type";

@Entity()
export class Farm {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column()
  public userId: string;

  @Column()
  public name: string;

  @Column({ type: "jsonb" })
  public address: Address;

  @Column({ type: "float" })
  public size: number;

  // yield is key word in node, hence yieldValue
  @Column({ name: "yield", type: "float" }) 
  public yieldValue: number;

  @Column({ type: "jsonb" })
  public coordinates: Coords;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  public drivingDistance: number = 0;
}
