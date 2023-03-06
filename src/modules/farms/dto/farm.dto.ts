import { Expose, Transform } from "class-transformer";
import { Address } from "modules/geo/types/address.type";
import { Farm } from "../entities/farm.entity";
import { Coords } from "../types/coords.type";

export class FarmDto {
  constructor(partial?: Partial<FarmDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  public readonly id: string;

  @Expose()
  public userId: string

  @Expose()
  public name: string;

  @Expose()
  public address: Address;

  @Expose()
  public yieldValue: number;

  @Expose()
  public coordinates: Coords;

  @Expose()
  public drivingDistance: number;

  @Transform(({ value }) => (value as Date).toISOString())
  @Expose()
  public createdAt: Date;

  @Transform(({ value }) => (value as Date).toISOString())
  @Expose()
  public updatedAt: Date;

  public static createFromEntity(farm: Farm): FarmDto {
    return new FarmDto({ ...farm });
  }
}
