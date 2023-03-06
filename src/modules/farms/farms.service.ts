import { OperationNotPermitted } from "errors/errors";
import { GeoService } from "modules/geo/geo.service";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { DeleteFarmDto } from "./dto/delete-farm.dto";
import { Farm } from "./entities/farm.entity";
import { IFarmsRepository, SaveFarmData } from "./repository/farms.repository";

export class FarmsService {
  constructor(
    private farmsRepository: IFarmsRepository,
    private geoService: GeoService
  ) { }

  public async createFarm(createFarmDto: CreateFarmDto): Promise<Farm> {
    const { userId, name, address, size, yieldValue } = createFarmDto;
    const farmData: SaveFarmData = {
      userId,
      name,
      address,
      size,
      yieldValue,
      coordinates: await this.geoService.getAddressCoordinates(address)  
    };

    return this.farmsRepository.save(farmData);
  }

  public async deleteFarm(deleteFarmDto: DeleteFarmDto): Promise<void> {
    const { farmId, authenticatedUserId } = deleteFarmDto;
    const farm = await this.farmsRepository.findById(farmId);

    if (farm) {
      if (farm.userId !== authenticatedUserId) {
        throw new OperationNotPermitted("Can't delete farm that it's not your own");
      }

      await this.farmsRepository.delete(farmId);
    }
  }
}
