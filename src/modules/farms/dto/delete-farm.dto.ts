import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class DeleteFarmDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  public farmId: string;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  public authenticatedUserId: string
}
