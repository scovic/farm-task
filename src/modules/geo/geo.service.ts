import { IGeoRepository } from "./geo.repository";
import { Address } from "./types/address.type";
import { Coords } from "./types/coords.type";

export class GeoService {
  constructor (
    private geoRepository: IGeoRepository
  ) {}

  public getAddressCoordinates(address: Address | string): Promise<Coords> {
    return this.geoRepository.getAddressCoordinates(address);
  }

  public calculateDrivingDistance(usersCoords: Coords, farmsCoords: Coords): Promise<number> {
    return this.geoRepository.calculateDistance(usersCoords, farmsCoords);
  }
}
