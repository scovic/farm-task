import { EntityNotFoundError } from "errors/errors";
import { GeoService } from "modules/geo/geo.service";
import { User } from "modules/users/entities/user.entity";
import { UsersService } from "modules/users/users.service";
import { GetAllFarmsDto } from "./dto/get-all-farms.dto";
import { FarmList } from "./entities/farm-list.entity";
import { Farm } from "./entities/farm.entity";
import { IFarmsRepository } from "./repository/farms.repository";

export class FarmListService {
  constructor (
    private farmsRepository: IFarmsRepository,
    private usersService: UsersService,
    private geoService: GeoService
  ) {}

  public async getAll(getAllFarmsDto: GetAllFarmsDto) {
    const { 
      filterOutliers,
      sortByDate,
      sortByDrivingDistance,
      sortByName,
      userId
    } = getAllFarmsDto;

    const user = await this.usersService.findOneBy({ id: userId });

    if (!user) {
      throw new EntityNotFoundError(`User doesn't exists (id ${userId})`)
    }

    const qb = this.farmsRepository.getQueryBuilder().select();

    if (sortByName) { 
      qb.orderBy("farm.name", "ASC");
    }

    if (sortByDate) {
      qb.addOrderBy("farm.createdAt", "DESC");
    }

    const farmList = FarmList.create(await qb.getMany());
    await this.calculateDrivingDistance(user, farmList.farms);

    if (sortByDrivingDistance) {
      farmList.sortByDrivingDistance();
    }

    if (filterOutliers) {
      const avgYield = farmList.getAverageYeild();
      return farmList.farms.filter(farm => this.isOutlier(farm, avgYield))
    }

    return farmList.farms;
  }

  private async calculateDrivingDistance(user: User, farms: Farm[]): Promise<void> {
    const userCoords = user.coordinates;
    const calculatedDrivingDistances = await Promise.all(
      farms.map(farm => this.geoService.calculateDrivingDistance(farm.coordinates, userCoords))
    );

    for (let i = 0; i < farms.length; i++) {
      farms[i].drivingDistance = calculatedDrivingDistances[i];
    }
  }

  private isOutlier(farm: Farm, avgYield: number): boolean {
    const referenceValue = 0.30 * avgYield;
    return farm.yieldValue === (referenceValue + avgYield) ||
      farm.yieldValue === (avgYield - referenceValue);
  }
}
