import { Repository, SelectQueryBuilder } from "typeorm";
import { Farm } from "../entities/farm.entity";

export type SaveFarmData = Omit<Farm, 
  "id" | 
  "drivingDistance" |
  "createdAt" |
  "updatedAt" |
  "user"
>

export interface IFarmsRepository {
  findById(id: string): Promise<Farm | null>;
  save(farm: SaveFarmData): Promise<Farm>;
  delete(id: string): Promise<void>;
  getQueryBuilder(): SelectQueryBuilder<Farm>;
}

export default class FarmsRepository implements IFarmsRepository {
  constructor(private farmsRepository: Repository<Farm>) {}

  public findById(id: string): Promise<Farm | null> {
    return this.farmsRepository.findOne({ where: { id }});
  }

  public save(farm: SaveFarmData): Promise<Farm> {
    return this.farmsRepository.save(farm);
  }

  public async delete(id: string): Promise<void> {
    await this.farmsRepository.delete({ id });
  }

  public getQueryBuilder(): SelectQueryBuilder<Farm> {
    return this.farmsRepository.createQueryBuilder("farm");
  }
}
