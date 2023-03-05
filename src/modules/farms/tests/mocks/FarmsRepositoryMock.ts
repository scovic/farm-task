import { IFarmsRepository } from "modules/farms/repository/FarmsRepository";

export const farmsRepositoryMock: IFarmsRepository = {
  delete: jest.fn(),
  findById: jest.fn(),
  save: jest.fn()
}
