import { Farm } from "modules/farms/entities/farm.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Coords } from "../types/coords.type";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public hashedPassword: string;

  @Column()
  public address: string;

  @Column({ type: "jsonb" })
  public coordinates: Coords;

  @OneToMany(() => Farm, farm => farm.user)
  farms: Farm[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
