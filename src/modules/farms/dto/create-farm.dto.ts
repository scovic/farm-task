import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateFarmDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  public userId: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString() // maybe add custom validator for an address
  @IsNotEmpty()
  public address: string;

  @IsNumber()
  @IsNotEmpty()
  public size: number;

  @IsNumber()
  @IsNotEmpty()
  public yieldValue: number;
}
