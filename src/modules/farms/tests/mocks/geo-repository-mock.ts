import { IGeoRepository } from "modules/geo/geo.repository";

export const geoRepositoryMock: IGeoRepository = {
  calculateDistance: jest.fn(),
  getAddressCoordinates: jest.fn()
}
