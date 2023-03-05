import { Expose } from "class-transformer";
import { Farm } from "../entities/farm.entity";
import { FarmDto } from "./farm.dto";

export class FarmListDto {
  constructor (farms: FarmDto[]) {
    this.farms = farms;
  }

  @Expose()
  public farms: FarmDto[]

  public static createFromFarmList(farmList: Farm[]): FarmListDto {
    return new FarmListDto(farmList.map(farm => FarmDto.createFromEntity(farm)));
  }
}
