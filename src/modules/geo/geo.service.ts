import { GeoRepository } from "./geo.repository";
import { Coords } from "./types/coords.type";

export class GeoService {
  constructor (
    private geoRepository: GeoRepository
  ) {}

  public getAddressCoordinates(address: string): Promise<Coords> {
    return this.geoRepository.getAddressCoordinates(address);
  }

  public calculateDrivingDistance(usersCoords: Coords, farmsCoords: Coords): Promise<number> {
    return this.geoRepository.calculateDistance(usersCoords, farmsCoords);
  }
}