import { IsBoolean, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class GetAllFarmsDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  public userId: string;

  @IsBoolean()
  public sortByName: boolean;

  @IsBoolean()
  public sortByDate: boolean;

  @IsBoolean()
  public sortByDrivingDistance: boolean;

  @IsBoolean()
  public filterOutliers: boolean = false;
}
