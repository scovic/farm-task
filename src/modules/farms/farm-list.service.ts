import { User } from "modules/users/entities/user.entity";
import { UsersService } from "modules/users/users.service";
import { Repository } from "typeorm";
import { GetAllFarmsDto } from "./dto/get-all-farms.dto";
import { FarmList } from "./entities/farm-list.entity";
import { Farm } from "./entities/farm.entity";

export class FarmListService {
  constructor (
    private farmsRepository: Repository<Farm>,
    private usersService: UsersService
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
    const qb = this.farmsRepository.createQueryBuilder("farm").select();

    if (sortByName) { 
      qb.addOrderBy("farm.name", "ASC");
    }

    if (sortByDate) {
      qb.addOrderBy("farm.createdAt", "DESC");
    }

    const farms = await qb.getMany();
    const farmList = FarmList.create(farms);
    await this.calculateDrivingDistance(user, farmList.farms);

    if (sortByDrivingDistance) {
      farmList.sortByDrivingDistance();
    }

    if (filterOutliers) {
      const avgYield = farmList.getAverageYeild(); // see if you can calculate through db query
      return farmList.farms.filter(farm => this.isOutlier(farm, avgYield))
    }

    return farmList.farms;
  }

  private async calculateDrivingDistance(user: User, farms: Farm[]): Promise<void> {
    for (let i = 0; i < farms.length; i++) {
      farms[i].drivingDistance = Math.floor(Math.random() * 1000);
    }
    return Promise.resolve();
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  private isOutlier(farm: Farm, avgYield: number): boolean {
    return Math.random() > 0.5;
  }
}
