import { User } from "modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Coords } from "../types/coords.type";

@Entity()
export class Farm {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column()
  public userId: string;

  @Column()
  public name: string;

  @Column()
  public address: string;

  @Column()
  public size: number;

  // yield is key word in node, hence yieldValue
  @Column({ name: "yield" }) 
  public yieldValue: number;

  @Column({ type: "jsonb" })
  public coordinates: Coords;

  @ManyToOne(() => User, user => user.farms)
  public user: User;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  public drivingDistance: number = 0;
}
