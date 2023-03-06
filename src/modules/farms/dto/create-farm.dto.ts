import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import { Address } from "modules/geo/types/address.type";

export class CreateFarmDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  public userId: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public address: Address;

  @IsNumber()
  @IsNotEmpty()
  public size: number;

  @IsNumber()
  @IsNotEmpty()
  public yieldValue: number;
}
