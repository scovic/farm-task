import { UnprocessableEntityError } from "errors/errors";
import { BingMapClient } from "infrastructure/bing-maps-client/bing-map-client";
// import { DistanceMatrixClient } from "infrastructure/distance-matrix-client/distance-matrix-client";
// import { Status } from "infrastructure/distance-matrix-client/types/status.type";
import { Address } from "./types/address.type";
import { Coords } from "./types/coords.type";

export interface IGeoRepository {
  calculateDistance(from: Coords, to: Coords): Promise<number>;
  getAddressCoordinates(address: Address | string): Promise<Coords>;
}

// Had to switch to bing maps api, didn't get api key in time for distance matrix client
export class GeoRepository implements IGeoRepository {
  constructor (
    // private distanceMatrixClient: DistanceMatrixClient,
    private bingMapsClient: BingMapClient
  ) {}

  public async calculateDistance(from: Coords, to: Coords): Promise<number> {
    const resp = await this.bingMapsClient.calculateDistance(from, to);

    if (resp.results.length === 0 || resp.results[0].hasError) {
      throw new UnprocessableEntityError("Couldn't calculate the distance");
    }

    return resp.results[0].travelDistance * 1000; // from km to m
  }

  public async getAddressCoordinates(address: Address | string): Promise<Coords> {
    if (typeof address === "string") {
      throw new Error("Can't handle address as a string")
    }

    const resp = await this.bingMapsClient.getAddressCoords(address);

    return {
      lat: `${resp.point.coordinates[0]}`,
      lng: `${resp.point.coordinates[1]}`
    }
  }

  // public async calculateDistance(from: Coords, to: Coords): Promise<number> {
  //   const response = await this.distanceMatrixClient.calculateDistance(from, to);

  //   if (response.status !== Status.OK) {
  //     throw new Error(`Couldn't calculate distance (status: ${response.status})`);
  //   }

  //   return response.rows[0].elements[0].distance.value;
  // }

  // public async getAddressCoordinates(address: string): Promise<Coords> {
  //   const response = await this.distanceMatrixClient.getAdddressCoords(address);

  //   if (response.status !== Status.OK) {
  //     throw new Error(`Couldn't get coords of the address (status: ${response.status})`);
  //   }

  //   const { lat, lng } = response.result[0].geometry.geometry;

  //   return {
  //     lat: `${lat}`,
  //     lng: `${lng}`
  //   }
  // }
}
