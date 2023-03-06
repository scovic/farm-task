import { IsNotEmpty, IsString } from "class-validator";

export class Coords {
  @IsString()
  @IsNotEmpty()
  public lat: string;
  
  @IsString()
  @IsNotEmpty()
  public lng: string;
}
