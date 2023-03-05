import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class GetUserDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  public userId: string;
}
