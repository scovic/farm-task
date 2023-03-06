import { DistanceMatrixClient } from "infrastructure/distanceMatrixClient/distanceMatrixClient";
import { Status } from "infrastructure/distanceMatrixClient/types/status.type";
import { Coords } from "./types/coords.type";

export interface IGeoRepository {
  calculateDistance(from: Coords, to: Coords): Promise<number>;
  getAddressCoordinates(address: string): Promise<Coords>;
}

export class GeoRepository implements IGeoRepository {
  constructor (private distanceMatrixClient: DistanceMatrixClient) {}

  public async calculateDistance(from: Coords, to: Coords): Promise<number> {
    const response = await this.distanceMatrixClient.calculateDistance(from, to);

    if (response.status !== Status.OK) {
      throw new Error(`Couldn't calculate distance (status: ${response.status})`);
    }

    return response.rows[0].elements[0].distance.value;
  }

  public async getAddressCoordinates(address: string): Promise<Coords> {
    const response = await this.distanceMatrixClient.getAdddressCoords(address);

    if (response.status !== Status.OK) {
      throw new Error(`Couldn't get coords of the address (status: ${response.status})`);
    }

    const { lat, lng } = response.result[0].geometry.geometry;

    return {
      lat: `${lat}`,
      lng: `${lng}`
    }
  }
}
