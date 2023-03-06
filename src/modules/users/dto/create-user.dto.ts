import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Address } from "modules/geo/types/address.type";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;

  @IsNotEmpty()
  public address: Address;
}
