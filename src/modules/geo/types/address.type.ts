import { IsNotEmpty, IsString } from "class-validator";

export class Address {
  @IsString()
  @IsNotEmpty()
  public countryCode: string;

  @IsString()
  @IsNotEmpty()
  public city: string;

  @IsString()
  @IsNotEmpty()
  public addressLine: string;
}
