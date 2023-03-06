import { IFarmsRepository } from "modules/farms/repository/farms.repository";

export const farmsRepositoryMock: IFarmsRepository = {
  delete: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  getQueryBuilder: jest.fn()
}
