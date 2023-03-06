/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import config from "config/config";
import fetch from "node-fetch";
import { Address } from "modules/geo/types/address.type";
import { Coords } from "modules/geo/types/coords.type";
import { CalculateDistanceType } from "./types/calculate-distance-response.type";
import { GetAddressCoordsResponse } from "./types/get-address-coordinates-response.type";

export class BingMapClient {
  private apiUrl: string;
  constructor() {
    this.apiUrl = "https://dev.virtualearth.net/REST/v1"
  }

  public async calculateDistance(from: Coords, to: Coords): Promise<CalculateDistanceType> {
    const { lat: fromLat, lng: formLng } = from;
    const { lat: toLat, lng: toLng} = to;
    const resp = await fetch(
      `${this.apiUrl}/Routes/DistanceMatrix?origins=${`${fromLat.trim()},${formLng.trim()}`}&destinations=${`${toLat.trim()},${toLng.trim()}`}&travelMode=driving&key=${config.BING_MAPS_KEY}`
    );

    const jsonResp = await resp.json();
    return jsonResp.resourceSets[0].resources[0] as Promise<CalculateDistanceType>;
  }

  public async getAddressCoords(address: Address): Promise<GetAddressCoordsResponse> {
    const { addressLine, city, countryCode } = address;

    const resp = await fetch(
      `${this.apiUrl}/Locations?countryRegion=${countryCode}&locality=${city}&addressLine=${addressLine}&key=${config.BING_MAPS_KEY}`
    );

    const jsonResp = await resp.json();
    return jsonResp.resourceSets[0].resources[0] as Promise<GetAddressCoordsResponse>;
  }
}
