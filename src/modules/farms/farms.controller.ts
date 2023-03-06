/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NextFunction, Request, Response } from "express";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { FarmListDto } from "./dto/farm-list.dto";
import { FarmDto } from "./dto/farm.dto";
import { GetAllFarmsDto } from "./dto/get-all-farms.dto";
import { FarmListService } from "./farm-list.service";
import { FarmsService } from "./farms.service";

export class FarmsController {
  constructor(
    private farmsService: FarmsService,
    private farmListService: FarmListService
  ) {}

  public async getAll(req: Request, resp: Response, next: NextFunction) {
    try {
      const sort: string = req.query.sort as string;
      const outliers: string = req.query.outliers as string;
      const sorts = sort ? sort.split(",") : "";
      const getAllFarmsDto: GetAllFarmsDto = {
        sortByName: sorts.includes("name"),
        sortByDate: sorts.includes("date"),
        sortByDrivingDistance: sorts.includes("distance"),
        filterOutliers: Boolean(outliers),
        userId: req.body.user.id
      }

      const farms = await this.farmListService.getAll(getAllFarmsDto);
      resp.status(200).send(FarmListDto.createFromFarmList(farms));
    } catch (error) {
      console.log(error)
      next(error);
    }
  }

  public async createFarm(req: Request, resp: Response, next: NextFunction) {
    try {
      const createFarmDto: CreateFarmDto = {
        ...req.body,
        userId: req.body.user.id
      }

      const farm = await this.farmsService.createFarm(createFarmDto);
      resp.status(201).send(FarmDto.createFromEntity(farm));
    } catch (error) {
      next(error);
    } 
  }

  public async deleteFarm(req: Request, resp: Response, next: NextFunction) {
    try {
      await this.farmsService.deleteFarm({ 
        farmId: req.params.id, 
        authenticatedUserId: req.body.user.id
      });

      resp.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
