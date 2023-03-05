/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { OperationNotPermitted } from "errors/errors";
import { CreateFarmDto } from "../dto/create-farm.dto";
import { DeleteFarmDto } from "../dto/delete-farm.dto";
import { Farm } from "../entities/farm.entity";
import { FarmsService } from "../farms.service";
import { farmsRepositoryMock } from "./mocks/FarmsRepositoryMock";

let farmsService: FarmsService;

beforeEach(() => {
  farmsService = new FarmsService(farmsRepositoryMock);
})

afterEach(() => {
  jest.clearAllMocks();
})

const farmEntityMock: Farm = {
  id: "id",
  userId: "user1",
  name: "name",
  address: "address",
  coordinates: {
    lat: "23.24",
    lng: "32.12"
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  size: 20.2,
  yieldValue: 14.2,
  drivingDistance: 0
}

describe("FarmsService", () => {
  describe("createFarm", () => {
    it("should create new farm", async () => {
      jest.spyOn(farmsService, "getCoordsByAddress").mockResolvedValue({
        lat: "0.0",
        lng: "0.0"
      });

      const createFarmDto: CreateFarmDto = {
        address: "Some address",
        name: "My farm",
        size: 5,
        userId: "userId",
        yieldValue: 20.2
      }

      await farmsService.createFarm(createFarmDto);

      expect(farmsRepositoryMock.save).toBeCalledTimes(1);
      expect(farmsRepositoryMock.save).toBeCalledWith({
        ...createFarmDto,
        coordinates: {
          lat: "0.0",
          lng: "0.0"
        }
      })
    })
  })

  describe("deleteFarm", () => {
    it("should delete farm", async () => {
      jest.spyOn(farmsRepositoryMock, "findById").mockResolvedValue(farmEntityMock);

      const deleteFarmDto: DeleteFarmDto = {
        authenticatedUserId: "user1",
        farmId: "id"
      }

      await farmsService.deleteFarm(deleteFarmDto);

      expect(farmsRepositoryMock.delete).toBeCalled();
      expect(farmsRepositoryMock.delete).toBeCalledWith("id")
    })

    it("should throw an OperationNotPermittedError when trying to delete other users farm", async () => {
      jest.spyOn(farmsRepositoryMock, "findById").mockResolvedValue(farmEntityMock);

      const deleteFarmDto: DeleteFarmDto = {
        authenticatedUserId: "user2",
        farmId: "id"
      }
      let error = null;

      try {
        await farmsService.deleteFarm(deleteFarmDto);
      } catch (err) {
        error = err;
      }

      expect(error).not.toBeNull();
      expect(error).toBeInstanceOf(OperationNotPermitted);
    })
  })
})
