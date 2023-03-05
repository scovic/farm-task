import { OperationNotPermitted } from "errors/errors";
import { Coords } from "types/coords.type";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { DeleteFarmDto } from "./dto/delete-farm.dto";
import { Farm } from "./entities/farm.entity";
import { IFarmsRepository, SaveFarmData } from "./repository/FarmsRepository";

export class FarmsService {
  constructor(private farmsRepository: IFarmsRepository) { }

  public async createFarm(createFarmDto: CreateFarmDto): Promise<Farm> {
    const { userId, name, address, size, yieldValue } = createFarmDto;
    const farmData: SaveFarmData = {
      userId,
      name,
      address,
      size,
      yieldValue,
      coordinates: await this.getCoordsByAddress()  
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  public async getCoordsByAddress(): Promise<Coords> {
    return Promise.resolve({
      lat: "0.00",
      lng: "0.00"
    });
  }
}
